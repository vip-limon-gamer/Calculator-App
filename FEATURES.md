# Calc Hub – status (tested with node)

## Done & tested
- SOLVE (SHIFT+CALC): equation with ALPHA+CALC "=", Newton + bracketing/bisection, "Can't Solve" when no real root.
- ←DMS (SHIFT + ° ′ ″): result toggles decimal ↔ °′″ (rounded to 1e-4 s).
- ∫dx: adaptive Simpson (was fixed 200-step Simpson).
- nCr/nPr: overflow-safe multiplicative algorithm, r up to 1000+, Math ERROR on overflow.
- Loan: whole-month term validation, 100-year cap.
- Percent: ÷0 handled. Units: below-absolute-zero check. Currency: offline/API-failure note, rate validation.
- Regression: zero-variance y → "undefined" instead of NaN (linear/log/exp/power/inverse/quadratic).

## CMPLX mode (MODE → 1 → 2) – done & tested in Node
+ − × ÷, i (ALPHA+ENG), Conj/Abs/Arg (SHIFT+, / ( / )), powers, √, ln, log, sin/cos/tan/sinh/cosh/tanh of complex values, rect↔polar toggle (ENG), ∠ polar input (SHIFT+(−)), ▶r∠θ / ▶a+bi (SHIFT + / −), Re↔Im (SHIFT+=). Variables/Ans hold the real part for memory; STO of a complex value stores only the real part. Not done: polar input (r∠θ), inverse trig of complex.
Hyperbolic and inverse-hyperbolic real functions checked (asinh/acosh/atanh round-trip).

## SD and REG modes (MODE → 1 → 1 for SD; MODE → 1 → 2 then 1–6 for Lin/Log/Exp/Pwr/Inv/Quad) – done & tested in Node
- Enter `x` (SD) or `x,y` (REG), optional `,freq` (positive integer), then M+. Display shows n=. SHIFT+M+ deletes that exact entry (delete + re-add = correction).
- SHIFT+1 S-SUM (Σx², Σx, n, Σy², Σy, Σxy), SHIFT+2 S-VAR (x̄, xσn, xσn−1, ȳ, yσn, yσn−1), SHIFT+3 REG (A, B, C, r, x̂, ŷ) insert values into any expression, e.g. `ŷ(6)`, `2×Σx`.
- Regression results cross-checked against the Statistics tab for all six models. Sums are of the raw x,y values (not log/inverse-transformed).
- CLR → 1 also clears all data. Constant y → r gives Math ERROR; all x equal → Math ERROR.
- Not done: data table viewer/scroll, x̂₁/x̂₂ for Quad, SD/REG ∠ edit of a stored point in place.

## BASE-N mode (MODE → 1 → 3, starts in DEC) – done & tested in Node
- SHIFT+hyp (BASE) picks DEC/HEX/BIN/OCT; the displayed result converts. ALPHA+A…F types hex digits. SHIFT+(−) (LOGIC): and, or, xor, xnor, Not(, Neg(, Shl(, Shr(.
- 32-bit two's complement (DEC −2147483648…2147483647; HEX/OCT/BIN show negatives as 32-bit patterns, e.g. −1 = FFFFFFFF). Precedence: ×÷ > +− > and > or/xor/xnor. Integer division truncates toward zero. + − × overflow → Math ERROR; ÷0 → Math ERROR; shifts are logical, count 0–31.
- Input validation: digits invalid for the base, “.”, EXP and non-BASE keys are ignored while typing; anything that still slips through → Syntax ERROR.
- Calc Hub extension (not on the physical fx-100MS): 32-bit width for BIN (the real calculator's BIN range is shorter), Shl/Shr, Neg/Not as bracket functions, unary −.

## EQN mode (MODE → MODE → MODE → 1, then pick a type) – done & tested in Node
- Types: 2 unknowns (a1X+b1Y=c1…), 3 unknowns (a1X+b1Y+c1Z=d1…), quadratic, cubic. Enter each coefficient then =. Coefficients accept expressions (e.g. 1÷3).
- After the last coefficient the roots show as X1, X2…; = or ▼ goes to the next, ▲ back. AC returns to the coefficients (old values kept; = keeps a value, type to change it) so you can edit and re-solve.
- Complex roots shown as a+bi (quadratic and cubic). Quadratic uses a cancellation-safe formula; cubic uses Cardano/trigonometric form polished with Newton (relative residual ≈ 6e-15 on 2000 random cubics). Root order: quadratic +√ root first; cubic real roots descending then the complex pair.
- Singular systems, a=0 (quad/cubic) → Math ERROR.
- Not done: R⇔I toggle, polynomial degree 4+ in the mode (the Solver tab handles up to degree 8).

## MAT mode (MODE ×2 → 2) – done & tested in Node
- Matrices MatA, MatB, MatC (default 3×3 zeros, up to 4×4). SHIFT+4 menu: 1 Dim (rows, cols, =; existing values kept), 2 Edit (cell by cell, = stores/keeps and advances, ▲▼ move, AC leaves), 3–8 insert MatA/MatB/MatC/MatAns/Det(/Trn(.
- Expressions: + − × ÷(by scalar), scalar×matrix (also implicit `2MatA`), x² x³ ^n (negative n = inverse, ^0 = identity), x⁻¹ (inverse), Det(, Trn(. Matrix results go to MatAns and are browsed with ▲▼◀▶; scalar results (Det) show normally.
- Errors: dimension mismatch → Dimension ERROR; mixed matrix/scalar +/−, matrix÷matrix, scalar÷matrix → Syntax ERROR; singular inverse → Math ERROR (pivot ≤1e-12×largest entry); dims outside 1–4 → Math ERROR.
- Result cells are rounded to 13 significant digits and values tiny relative to the matrix are shown as 0 (so A×A⁻¹ shows 1 and 0). Checked A·A⁻¹≈I within 3e-14 on 900 random 2×2–4×4 matrices.
- Not done: matrices bigger than 4×4, storing MatAns into MatA, scalar functions (sin( etc.) inside a matrix expression.

## VCT mode (MODE ×2 → 3) – done & tested in Node
- Vectors VctA, VctB, VctC (default 3-D zeros; 2-D or 3-D). SHIFT+5 menu: 1 Dim (2 or 3; old values kept), 2 Edit (component by component, = stores/keeps and advances, ▲▼ move, AC leaves), 3–6 VctA/VctB/VctC/VctAns, 7 Dot, 8 Abs(, 9 Ang(.
- Operators: + −, scalar × vector (also implicit `2VctA`), vector ÷ scalar, vector × vector = cross product, `Dot`, `Abs(v)` magnitude, `Ang(a,b)` angle in the current Deg/Rad/Gra unit. An operator typed after a vector result starts from VctAns.
- Errors: different sizes or scalar±vector → Dimension ERROR; ÷0, zero-length vector in Ang → Math ERROR; vector×vector without ×, vector², scalar÷vector → Syntax ERROR; Dim other than 2/3 → Dimension ERROR.
- Checked: cross product ⟂ both operands (exact), Lagrange identity on 500 random pairs, Ang of perpendicular = 90°.
- Calc Hub extensions (not on the physical fx-100MS): Ang(, 2-D × 2-D (returns a 3-D vector with z only), cross product via ×.
- Not done: scalar functions (sin( …) inside vector expressions, unit vector, storing VctAns into VctA.

## NOT yet implemented (do not rely on these)
FIX/SCI/ENG audit, replay/edit audit, extra STO/RCL workflow, fraction simplification audit, standard-calculator % audit.

## fx-100MS native vs Calc Hub extras
Native: COMP, SOLVE, ∫dx, d/dx, DMS, nPr/nCr, CALC, memories A–F X Y M. Calc Hub extras: Currency, Units, Loan, BMI, Age, Percent tabs.

## Keypad-label audit fixes (added)
Now working: % (ALPHA+=), mod (ALPHA+÷), multi-statement ':' (ALPHA+∫dx), Pol( / Rec( (SHIFT + / −, result in X,Y), Rnd( (SHIFT/ALPHA+0), Ran#( (ALPHA+·, random integer a..b), Log( (ALPHA+CONST, base,x), Σ( (ALPHA+7), DRG▶ (SHIFT+Ans: ° ʳ ᵍ marks), engineering symbols (SHIFT+6/7/8/9 = k M G T, ALPHA+1/2/3/4/5 = f p n μ m; ALPHA+9 PREFIX or MODE Disp page toggles Eng display), ENG ← (SHIFT+ENG), UNDO (ALPHA+DEL), OFF (SHIFT+AC, ON wakes), DISTR P( Q( R( ▶t( (SHIFT+3 in SD mode), base keys x²/^/log/ln = DEC/HEX/BIN/OCT in BASE mode, LOGIC on ALPHA+x⁻¹, SHIFT+( = arg and SHIFT+) = Abs (as printed), sin(π)=0 in Rad, trailing '.' like the LCD.
Not done: COPY/RCL labels on the REPLAY pad (purpose unclear), PREFIX meaning is a guess.
