import numpy as np
import json

try:
    from qiskit import QuantumCircuit
    from qiskit_aer import AerSimulator
    QA = True
except ImportError:
    QA = False

def generate_patients(n: int=20, s: int=42) -> list:
    np.random.seed(s)
    ps = []
    ds = ["T2DM", "T1DM", "Pre-diabetic", "Hypertension"]
    for i in range(n):
        ps.append({
            "id": f"PAT_{i+1:04d}",
            "age": int(np.random.randint(30, 75)),
            "gender": np.random.choice(["M", "F"]),
            "diagnosis": np.random.choice(ds, p=[0.5, 0.2, 0.2, 0.1]),
            "hba1c": round(np.random.uniform(5.5, 12.0), 1),
            "cardiac_history": bool(np.random.choice([True, False], p=[0.2, 0.8])),
            "insulin_dose": int(np.random.randint(0, 80)),
            "predicted_response_score": round(np.random.uniform(0.3, 1.0), 3),
            "cost": int(np.random.randint(5000, 25000)),
            "diversity_score": round(np.random.uniform(0.4, 1.0), 2),
        })
    return ps

def filter_eligible(ps: list, c: dict) -> list:
    el = []
    for p in ps:
        a = c.get("min_age", 0) <= p["age"] <= c.get("max_age", 999)
        d = p["diagnosis"] in c.get("diagnoses", [p["diagnosis"]])
        h = not p["cardiac_history"] if c.get("exclude_cardiac", False) else True
        i = p["insulin_dose"] <= c.get("max_insulin", 9999)
        if a and d and h and i:
            el.append(p)
    return el

def build_qubo_matrix(ps: list, target_n: int, budget: float, pb: float=0.5, pc: float=1.0) -> np.ndarray:
    n = len(ps)
    Q = np.zeros((n, n))
    sc = np.array([p["predicted_response_score"] for p in ps])
    ct = np.array([p["cost"] for p in ps])
    for i in range(n):
        Q[i][i] -= sc[i]
    bn = budget / 1e6
    cn = ct / 1e6
    for i in range(n):
        Q[i][i] += pb * (cn[i]**2 - 2 * bn * cn[i])
        for j in range(i+1, n):
            Q[i][j] += 2 * pb * cn[i] * cn[j]
    for i in range(n):
        Q[i][i] += pc * (1 - 2 * target_n)
        for j in range(i+1, n):
            Q[i][j] += 2 * pc
    return Q

def quantum_optimize(Q: np.ndarray, ps: list, target_n: int, sh: int=1024) -> dict:
    n = len(ps)
    qc = QuantumCircuit(n, n)
    qc.h(range(n))
    for i in range(n):
        ag = float(np.clip(Q[i][i] * np.pi, -np.pi, np.pi))
        qc.rz(ag, i)
    for i in range(n - 1):
        qc.cx(i, i + 1)
        if Q[i][i+1] != 0:
            ag = float(np.clip(Q[i][i+1] * np.pi / 2, -np.pi, np.pi))
            qc.rz(ag, i + 1)
        qc.cx(i, i + 1)
    qc.h(range(n))
    qc.measure(range(n), range(n))
    sm = AerSimulator()
    jb = sm.run(qc, shots=sh)
    ct = jb.result().get_counts()
    bb = None
    bs = -999
    for b, c in ct.items():
        bt = [int(x) for x in reversed(b)]
        si = [i for i, x in enumerate(bt) if x == 1]
        if len(si) == 0: continue
        ts = sum(ps[i]["predicted_response_score"] for i in si)
        cp = abs(len(si) - target_n) * 0.5
        es = ts - cp
        if es > bs:
            bs = es
            bb = b
    if bb is None: bb = "0" * n
    bt = [int(x) for x in reversed(bb)]
    si = [i for i, x in enumerate(bt) if x == 1]
    sp = [ps[i] for i in si]
    ts = sum(p["predicted_response_score"] for p in sp)
    tc = sum(p["cost"] for p in sp)
    return {
        "method": "Quantum QUBO Optimizer (Qiskit Aer Simulator)",
        "qubits_used": n,
        "shots": sh,
        "unique_states_explored": len(ct),
        "best_bitstring": bb,
        "selected_count": len(sp),
        "target_count": target_n,
        "selected_patients": sp,
        "total_response_score": round(ts, 3),
        "total_cost": tc,
        "circuit_depth": qc.depth(),
        "circuit_gates": dict(qc.count_ops()),
    }

def classical_optimize(ps: list, target_n: int, budget: float) -> dict:
    sps = sorted(ps, key=lambda p: p["predicted_response_score"], reverse=True)
    sd = []
    tc = 0
    for p in sps:
        if len(sd) >= target_n: break
        if tc + p["cost"] <= budget:
            sd.append(p)
            tc += p["cost"]
    if len(sd) < target_n:
        sd = sps[:target_n]
        tc = sum(p["cost"] for p in sd)
    ts = sum(p["predicted_response_score"] for p in sd)
    return {
        "method": "Classical Greedy Optimizer",
        "qubits_used": 0,
        "shots": 0,
        "unique_states_explored": len(ps),
        "best_bitstring": "N/A",
        "selected_count": len(sd),
        "target_count": target_n,
        "selected_patients": sd,
        "total_response_score": round(ts, 3),
        "total_cost": tc,
        "circuit_depth": 0,
        "circuit_gates": {},
    }

def optimize_cohort(criteria: dict, target_n: int=5, budget: float=100000.0) -> dict:
    ps = generate_patients(n=50)
    el = filter_eligible(ps, criteria)
    if len(el) < target_n:
        return {"error": f"Only {len(el)} eligible patients found. Need at least {target_n}."}
    cd = sorted(el, key=lambda p: p["predicted_response_score"], reverse=True)[:15]
    if QA:
        Q = build_qubo_matrix(cd, target_n=target_n, budget=budget)
        rs = quantum_optimize(Q, cd, target_n=target_n)
    else:
        rs = classical_optimize(cd, target_n=target_n, budget=budget)
    return {
        "total_patients_screened": len(ps),
        "eligible_after_filter": len(el),
        "candidates_sent_to_optimizer": len(cd),
        "quantum_available": QA,
        "quantum_result": rs,
        "combinatorial_complexity": f"C({len(el)},{target_n})",
        "qubo_matrix_size": f"{len(cd)}x{len(cd)}",
    }
