import re
from dataclasses import dataclass, field
from typing import Any

tp = [
    ("K", r"\b(TRIAL|PATIENT|EXCLUDE|INCLUDE|DURATION|ARMS|SITES|BUDGET|MONITOR)\b"),
    ("O", r"(>=|<=|!=|=|>|<|IN|NOT IN|AND|OR)"),
    ("R", r"\[\s*\d+\s*,\s*\d+\s*\]"),
    ("N", r"\d+(\.\d+)?"),
    ("S", r'"[^"]*"'),
    ("I", r"[a-zA-Z_][a-zA-Z0-9_]*"),
    ("LB", r"\{"),
    ("RB", r"\}"),
    ("C", r":"),
    ("CM", r","),
    ("NL", r"\n"),
    ("SK", r"[ \t]+"),
]

@dataclass
class Tk:
    t: str
    v: str
    l: int

class Lx:
    def __init__(s, sr: str):
        s.sr = sr
        s.tk = []
        s.er = []

    def tx(s):
        ln = 1
        mr = re.compile("|".join(f"(?P<{n}>{p})" for n, p in tp))
        for m in mr.finditer(s.sr):
            k = m.lastgroup
            v = m.group()
            if k == "NL": ln += 1
            elif k in ("SK", "C"): pass
            else: s.tk.append(Tk(k, v, ln))
        return s.tk

@dataclass
class TN:
    n: str
    s: dict = field(default_factory=dict)

@dataclass
class RN:
    f: str
    o: str
    v: Any

@dataclass
class SN:
    n: str
    r: list = field(default_factory=list)

class Pr:
    def __init__(s, tk):
        s.tk = tk
        s.p = 0
        s.er = []

    def pk(s): return s.tk[s.p] if s.p < len(s.tk) else None

    def cn(s, et=None):
        t = s.pk()
        if not t: return None
        if et and t.t != et:
            s.er.append(f"L{t.l}: E{et} G{t.t}")
            return None
        s.p += 1
        return t

    def pr(s):
        s.cn("K")
        nt = s.cn("I")
        tn = nt.v if nt else "unnamed"
        s.cn("LB")
        sc = {}
        while s.pk() and s.pk().t != "RB":
            cs = s.ps()
            if cs: sc[cs.n] = cs
        s.cn("RB")
        return TN(n=tn, s=sc)

    def ps(s):
        kw = s.cn("K")
        if not kw:
            s.p += 1
            return None
        s.cn("C")
        rs = s.prl()
        return SN(n=kw.v, r=rs)

    def prl(s):
        rl = []
        while s.pk() and s.pk().t not in ("K", "RB"):
            r = s.psr()
            if r: rl.append(r)
            if s.pk() and s.pk().t == "CM": s.cn("CM")
        return rl

    def psr(s):
        ft = s.cn("I")
        if not ft: return None
        ot = s.cn("O")
        if not ot: return None
        vt = s.pk()
        if vt and vt.t in ("N", "S", "R", "I"):
            s.p += 1
            return RN(f=ft.v, o=ot.v, v=vt.v)
        return None

class SA:
    def __init__(s, a: TN):
        s.a = a
        s.w = []
        s.e = []

    def az(s):
        s._cr()
        s._cd()
        s._ca()
        s._cc()
        return {"errors": s.e, "warnings": s.w}

    def _cr(s):
        rq = ["PATIENT", "DURATION", "ARMS"]
        for r in rq:
            if r not in s.a.s: s.e.append(f"M {r}")

    def _cd(s):
        d = s.a.s.get("DURATION")
        if d:
            for r in d.r:
                try:
                    m = int(str(r.v).replace('"','').split()[0])
                    if m > 12: s.w.append("DW")
                    if m <= 0: s.e.append("DE")
                except: pass

    def _ca(s):
        a = s.a.s.get("ARMS")
        if a and len(a.r) == 0: s.e.append("AE")

    def _cc(s):
        p = s.a.s.get("PATIENT")
        x = s.a.s.get("EXCLUDE")
        if not p or not x: return
        pa = [r for r in p.r if r.f == "age"]
        xa = [r for r in x.r if r.f == "age"]
        if pa and xa: s.w.append("ACW")

FR = [
    {"id": "FDA-001", "description": "S1", "check": lambda a: "MONITOR" in a.s, "severity": "ERROR"},
    {"id": "FDA-002", "description": "S2", "check": lambda a: "SITES" in a.s, "severity": "WARNING"},
    {"id": "FDA-003", "description": "S3", "check": lambda a: "BUDGET" in a.s, "severity": "WARNING"},
    {"id": "FDA-004", "description": "S4", "check": lambda a: bool(a.n and a.n != "unnamed"), "severity": "ERROR"},
]

class CC:
    def __init__(s, a: TN):
        s.a = a
        s.v = []
        s.p = []

    def ch(s):
        for r in FR:
            try: pd = r["check"](s.a)
            except: pd = False
            en = {"id": r["id"], "description": r["description"], "severity": r["severity"], "status": "PASS" if pd else "FAIL"}
            if pd: s.p.append(en)
            else: s.v.append(en)
        return {"violations": s.v, "passed": s.p}

def compile_trial(sc: str) -> dict:
    lx = Lx(sc)
    ts = lx.tx()
    ps = Pr(ts)
    at = ps.pr()
    sm = SA(at)
    sr = sm.az()
    cc = CC(at)
    cr = cc.ch()
    ir = {"trial_name": at.n, "sections": {n: [{"field": r.f, "operator": r.o, "value": r.v} for r in sc.r] for n, sc in at.s.items()}}
    
    return {
        "success": len(ps.er + sr["errors"]) == 0,
        "trial_name": at.n,
        "ir": ir,
        "tokens_count": len(ts),
        "errors": ps.er + sr["errors"],
        "warnings": sr["warnings"],
        "compliance": cr,
        "stages_completed": ["LEXER", "PARSER", "AST", "SEMANTIC_ANALYSIS", "COMPLIANCE_CHECK"],
    }
