/* ===================================================================
   MathMaster — lessonsData.js
   Static content: 13 topics, each with multiple lessons.
   Each lesson: { id, topic, title, summary, difficulty, minutes, body:[blocks] }
   body block types: h2, p, formula, callout, ul, ol, steps, example
   =================================================================== */
(function () {
  "use strict";
  const MM = (window.MM = window.MM || {});

  const TOPICS = [
    { id: "arithmetic",    name: "Arithmetic",            icon: "calc",     color: "#6366f1", desc: "The four operations, order of operations, and number sense." },
    { id: "fractions",     name: "Fractions",             icon: "pi",       color: "#8b5cf6", desc: "Understand, compare, and compute with fractions." },
    { id: "decimals",      name: "Decimals",              icon: "percent",  color: "#ec4899", desc: "Decimal place value, arithmetic, and conversions." },
    { id: "percentages",   name: "Percentages",           icon: "percent",  color: "#f59e0b", desc: "Percent of a number, increase/decrease, and applications." },
    { id: "algebra",       name: "Algebra Basics",        icon: "calc",     color: "#10b981", desc: "Variables, expressions, and simplifying like terms." },
    { id: "equations",     name: "Equations",             icon: "calc",     color: "#06b6d4", desc: "Solve linear equations step by step." },
    { id: "inequalities",  name: "Inequalities",          icon: "calc",     color: "#3b82f6", desc: "Solve and graph linear inequalities." },
    { id: "factoring",     name: "Factoring",             icon: "calc",     color: "#a855f7", desc: "Factor quadratics and common expressions." },
    { id: "expanding",     name: "Expanding Expressions", icon: "calc",     color: "#ef4444", desc: "Use the distributive law and binomial products." },
    { id: "coordinate",    name: "Coordinate Geometry",   icon: "grid",     color: "#14b8a6", desc: "Slope, midpoint, and distance in the plane." },
    { id: "geometry",      name: "Geometry",              icon: "shape",    color: "#f97316", desc: "Shapes, perimeter, area, and volume." },
    { id: "statistics",    name: "Statistics",            icon: "stats",    color: "#0ea5e9", desc: "Mean, median, mode, range, and data displays." },
    { id: "probability",   name: "Probability",           icon: "dice",     color: "#d946ef", desc: "Counting outcomes and computing likelihoods." },
  ];

  const LESSONS = [
    /* ===== ARITHMETIC ===== */
    {
      id: "arith-1", topic: "arithmetic", title: "The Four Operations", difficulty: "Beginner", minutes: 6,
      summary: "Addition, subtraction, multiplication, and division are the foundation of all mathematics.",
      body: [
        { type: "p", text: "Arithmetic is the study of numbers and the basic operations we perform on them. Every more advanced topic builds on these four operations: addition (+), subtraction (−), multiplication (×), and division (÷)." },
        { type: "h2", text: "Addition and Subtraction" },
        { type: "p", text: "Addition combines two quantities. Subtraction finds the difference between them. They are inverse operations: if a + b = c, then c − b = a." },
        { type: "example", q: "Compute 47 + 38.", a: "85", steps: ["47 + 38", "Line up by place value: 7 + 8 = 15 (write 5, carry 1)", "4 + 3 + 1 = 8", "Answer: 85"] },
        { type: "h2", text: "Multiplication and Division" },
        { type: "p", text: "Multiplication is repeated addition; division splits a quantity into equal groups. They are also inverse operations." },
        { type: "formula", text: "a × b = b + b + ... + b \\quad (a times)" },
        { type: "example", q: "Compute 7 × 8.", a: "56", steps: ["Think of 7 groups of 8", "8 + 8 + 8 + 8 + 8 + 8 + 8 = 56"] },
        { type: "callout", kind: "tip", title: "Memorize the times tables", text: "Knowing products up to 12 × 12 by heart makes every later topic faster and less error-prone." },
      ],
    },
    {
      id: "arith-2", topic: "arithmetic", title: "Order of Operations", difficulty: "Beginner", minutes: 7,
      summary: "Learn PEMDAS so every expression has exactly one correct value.",
      body: [
        { type: "p", text: "When an expression has more than one operation, we need rules to decide the order. The universal rule is PEMDAS." },
        { type: "formula", text: "PEMDAS: Parentheses → Exponents → ×/÷ (left to right) → +/− (left to right)" },
        { type: "example", q: "Evaluate 3 + 4 × 2².", a: "19", steps: ["Exponent first: 2² = 4", "Multiply: 4 × 4 = 16", "Add: 3 + 16 = 19"] },
        { type: "callout", kind: "warn", title: "Common mistake", text: "3 + 4 × 2 is NOT 7 × 2 = 14. Multiplication comes before addition, so the answer is 3 + 8 = 11." },
        { type: "example", q: "Evaluate (3 + 4) × 2.", a: "14", steps: ["Parentheses first: 3 + 4 = 7", "Multiply: 7 × 2 = 14"] },
      ],
    },
    {
      id: "arith-3", topic: "arithmetic", title: "Factors, Multiples & Primes", difficulty: "Intermediate", minutes: 8,
      summary: "Divisibility, prime numbers, and the building blocks of integers.",
      body: [
        { type: "p", text: "A factor of a number divides it exactly (no remainder). A multiple is the result of multiplying the number by an integer." },
        { type: "h2", text: "Prime Numbers" },
        { type: "p", text: "A prime number has exactly two factors: 1 and itself. The first primes are 2, 3, 5, 7, 11, 13, 17, …" },
        { type: "formula", text: "\\text{Prime factorization of 60} = 2^2 \\times 3 \\times 5" },
        { type: "example", q: "Find the prime factorization of 84.", a: "2² × 3 × 7", steps: ["84 = 2 × 42", "42 = 2 × 21", "21 = 3 × 7", "So 84 = 2 × 2 × 3 × 7 = 2² × 3 × 7"] },
        { type: "callout", kind: "tip", title: "GCF and LCM", text: "The Greatest Common Factor (GCF) is the largest factor two numbers share. The Least Common Multiple (LCM) is the smallest number both divide into evenly." },
      ],
    },

    /* ===== FRACTIONS ===== */
    {
      id: "frac-1", topic: "fractions", title: "Understanding Fractions", difficulty: "Beginner", minutes: 6,
      summary: "Numerators, denominators, and what a fraction really represents.",
      body: [
        { type: "p", text: "A fraction represents a part of a whole. It has two parts: the numerator (top) counts how many parts we have, and the denominator (bottom) tells how many equal parts the whole is divided into." },
        { type: "formula", text: "\\frac{\\text{numerator}}{\\text{denominator}}" },
        { type: "h2", text: "Equivalent Fractions" },
        { type: "p", text: "Multiplying or dividing both numerator and denominator by the same non-zero number gives an equivalent fraction with the same value." },
        { type: "example", q: "Simplify 12/18.", a: "2/3", steps: ["GCF of 12 and 18 is 6", "12 ÷ 6 = 2", "18 ÷ 6 = 3", "Answer: 2/3"] },
        { type: "callout", kind: "warn", title: "Never divide by zero", text: "The denominator can never be 0 — division by zero is undefined." },
      ],
    },
    {
      id: "frac-2", topic: "fractions", title: "Adding & Subtracting Fractions", difficulty: "Intermediate", minutes: 8,
      summary: "Find common denominators to combine fractions correctly.",
      body: [
        { type: "p", text: "You can only add or subtract fractions when they share the same denominator. To do so, rewrite them with a common denominator — usually the LCM of the two denominators." },
        { type: "formula", text: "\\frac{a}{b} + \\frac{c}{d} = \\frac{a \\cdot d + c \\cdot b}{b \\cdot d}" },
        { type: "example", q: "Add 1/4 + 2/3.", a: "11/12", steps: ["Common denominator: 4 × 3 = 12", "1/4 = 3/12", "2/3 = 8/12", "3/12 + 8/12 = 11/12"] },
        { type: "callout", kind: "tip", title: "Always simplify", text: "After computing, reduce the result to lowest terms by dividing top and bottom by their GCF." },
      ],
    },
    {
      id: "frac-3", topic: "fractions", title: "Multiplying & Dividing Fractions", difficulty: "Intermediate", minutes: 7,
      summary: "These operations don't need common denominators — multiply straight across!",
      body: [
        { type: "p", text: "Multiplying fractions is straightforward: multiply the numerators, then multiply the denominators." },
        { type: "formula", text: "\\frac{a}{b} \\times \\frac{c}{d} = \\frac{a \\cdot c}{b \\cdot d}" },
        { type: "p", text: "To divide, multiply by the reciprocal of the second fraction (flip it upside down)." },
        { type: "formula", text: "\\frac{a}{b} \\div \\frac{c}{d} = \\frac{a}{b} \\times \\frac{d}{c} = \\frac{a \\cdot d}{b \\cdot c}" },
        { type: "example", q: "Compute 2/3 ÷ 4/5.", a: "5/6", steps: ["Flip the second: 4/5 → 5/4", "Multiply: (2/3) × (5/4) = 10/12", "Simplify: 10/12 = 5/6"] },
      ],
    },

    /* ===== DECIMALS ===== */
    {
      id: "dec-1", topic: "decimals", title: "Place Value & Reading Decimals", difficulty: "Beginner", minutes: 6,
      summary: "Each digit's position to the right of the decimal point has a value ten times smaller.",
      body: [
        { type: "p", text: "Decimals extend our place-value system to represent parts of a whole. The first place after the decimal is tenths (1/10), then hundredths (1/100), then thousandths (1/1000), and so on." },
        { type: "formula", text: "0.1 = \\frac{1}{10}, \\quad 0.01 = \\frac{1}{100}, \\quad 0.001 = \\frac{1}{1000}" },
        { type: "example", q: "Write 3.705 in expanded form.", a: "3 + 0.7 + 0.005", steps: ["3 is in the ones place", "7 is in the tenths place → 0.7", "0 is in the hundredths place", "5 is in the thousandths place → 0.005"] },
      ],
    },
    {
      id: "dec-2", topic: "decimals", title: "Decimal Arithmetic", difficulty: "Intermediate", minutes: 7,
      summary: "Line up the decimal point for + and −, count places for ×.",
      body: [
        { type: "h2", text: "Adding and Subtracting" },
        { type: "p", text: "Line up the decimal points vertically, then add or subtract as usual, filling empty places with zeros." },
        { type: "example", q: "Compute 3.45 + 2.8.", a: "6.25", steps: ["Align: 3.45 + 2.80", "5 + 0 = 5", "4 + 8 = 12 (carry 1)", "3 + 2 + 1 = 6", "Answer: 6.25"] },
        { type: "h2", text: "Multiplying" },
        { type: "p", text: "Multiply as if there were no decimal points, then place the decimal so the result has as many decimal places as the two factors combined." },
        { type: "example", q: "Compute 0.6 × 0.4.", a: "0.24", steps: ["6 × 4 = 24", "0.6 has 1 decimal place, 0.4 has 1 → total 2", "Answer: 0.24"] },
      ],
    },
    {
      id: "dec-3", topic: "decimals", title: "Converting Fractions & Decimals", difficulty: "Intermediate", minutes: 6,
      summary: "Every fraction is a division problem in disguise.",
      body: [
        { type: "p", text: "To convert a fraction to a decimal, divide the numerator by the denominator. To go the other way, write the decimal as a fraction over 10, 100, or 1000 and simplify." },
        { type: "example", q: "Convert 3/8 to a decimal.", a: "0.375", steps: ["3 ÷ 8 = 0.375", "Check: 0.375 × 8 = 3 ✓"] },
        { type: "example", q: "Convert 0.45 to a fraction.", a: "9/20", steps: ["0.45 = 45/100", "GCF of 45 and 100 is 5", "45 ÷ 5 = 9, 100 ÷ 5 = 20", "Answer: 9/20"] },
      ],
    },

    /* ===== PERCENTAGES ===== */
    {
      id: "pct-1", topic: "percentages", title: "Understanding Percentages", difficulty: "Beginner", minutes: 5,
      summary: "Percent means 'per hundred' — a special fraction with denominator 100.",
      body: [
        { type: "p", text: "A percentage is a number expressed as a fraction of 100. The symbol % means 'per hundred', so 25% = 25/100 = 0.25." },
        { type: "formula", text: "x\\% = \\frac{x}{100} = 0.0x \\text{ (shift the decimal 2 places left)}" },
        { type: "example", q: "Convert 45% to a decimal and a fraction.", a: "0.45 = 9/20", steps: ["Decimal: 45% = 0.45", "Fraction: 45/100", "Simplify: divide both by 5 → 9/20"] },
      ],
    },
    {
      id: "pct-2", topic: "percentages", title: "Percent of a Number", difficulty: "Intermediate", minutes: 6,
      summary: "Find a percentage of any quantity — useful for tips, discounts, and taxes.",
      body: [
        { type: "p", text: "To find x% of a number, convert the percent to a decimal and multiply." },
        { type: "formula", text: "x\\% \\text{ of } N = \\frac{x}{100} \\times N" },
        { type: "example", q: "What is 15% of 80?", a: "12", steps: ["15% = 0.15", "0.15 × 80 = 12"] },
        { type: "callout", kind: "tip", title: "Real-world uses", text: "Tips at restaurants (15–20%), sales tax, and discounts are all 'percent of a number' problems." },
      ],
    },
    {
      id: "pct-3", topic: "percentages", title: "Increase & Decrease", difficulty: "Intermediate", minutes: 7,
      summary: "Calculate how much a value grew or shrank, as a percentage.",
      body: [
        { type: "formula", text: "\\%\\text{ change} = \\frac{\\text{new} - \\text{old}}{\\text{old}} \\times 100" },
        { type: "example", q: "A shirt's price goes from $40 to $50. What is the percent increase?", a: "25%", steps: ["Difference: 50 − 40 = 10", "10 / 40 = 0.25", "0.25 × 100 = 25%"] },
        { type: "callout", kind: "warn", title: "Always divide by the ORIGINAL", text: "The denominator is the starting value, not the new one. A common mistake is dividing by the wrong number." },
      ],
    },

    /* ===== ALGEBRA ===== */
    {
      id: "alg-1", topic: "algebra", title: "Variables & Expressions", difficulty: "Beginner", minutes: 6,
      summary: "Letters stand for unknown numbers — the heart of algebra.",
      body: [
        { type: "p", text: "A variable is a letter (like x, y, or n) that represents an unknown number. An algebraic expression combines variables, numbers, and operations, such as 3x + 5." },
        { type: "h2", text: "Terms, Coefficients, and Constants" },
        { type: "ul", items: ["Term: a single part of an expression, like 3x or 5", "Coefficient: the number multiplying a variable (the 3 in 3x)", "Constant: a term with no variable (the 5 in 3x + 5)"] },
        { type: "example", q: "In 7y − 4, identify the coefficient and constant.", a: "Coefficient 7, constant −4", steps: ["7y has coefficient 7", "−4 has no variable, so it's the constant"] },
      ],
    },
    {
      id: "alg-2", topic: "algebra", title: "Simplifying Expressions", difficulty: "Intermediate", minutes: 7,
      summary: "Combine like terms to write expressions more simply.",
      body: [
        { type: "p", text: "Like terms have the same variable raised to the same power. We combine them by adding or subtracting their coefficients." },
        { type: "formula", text: "3x + 5x = 8x \\qquad 7y - 2y = 5y" },
        { type: "example", q: "Simplify 4x + 3 − 2x + 7.", a: "2x + 10", steps: ["Group like terms: (4x − 2x) + (3 + 7)", "Combine: 2x + 10"] },
        { type: "callout", kind: "warn", title: "Don't combine unlike terms", text: "3x and 3x² are NOT like terms, and neither are 3x and 3y. Leave them separate." },
      ],
    },
    {
      id: "alg-3", topic: "algebra", title: "The Distributive Property", difficulty: "Intermediate", minutes: 6,
      summary: "Multiply a term across a sum or difference in parentheses.",
      body: [
        { type: "formula", text: "a(b + c) = ab + ac \\qquad a(b - c) = ab - ac" },
        { type: "example", q: "Expand 3(2x + 5).", a: "6x + 15", steps: ["3 × 2x = 6x", "3 × 5 = 15", "Result: 6x + 15"] },
        { type: "example", q: "Expand −2(4x − 3).", a: "−8x + 6", steps: ["−2 × 4x = −8x", "−2 × (−3) = +6", "Result: −8x + 6"] },
      ],
    },

    /* ===== EQUATIONS ===== */
    {
      id: "eq-1", topic: "equations", title: "Solving One-Step Equations", difficulty: "Beginner", minutes: 6,
      summary: "Use inverse operations to isolate the variable.",
      body: [
        { type: "p", text: "An equation has an equals sign and can be solved to find the value of the variable. The golden rule: whatever you do to one side, you must do to the other." },
        { type: "formula", text: "\\text{If } x + a = b, \\text{ then } x = b - a" },
        { type: "example", q: "Solve x + 7 = 15.", a: "x = 8", steps: ["Subtract 7 from both sides", "x = 15 − 7 = 8"] },
        { type: "example", q: "Solve 3x = 21.", a: "x = 7", steps: ["Divide both sides by 3", "x = 21 / 3 = 7"] },
      ],
    },
    {
      id: "eq-2", topic: "equations", title: "Two-Step Equations", difficulty: "Intermediate", minutes: 7,
      summary: "Undo operations in reverse order: addition/subtraction first, then multiplication/division.",
      body: [
        { type: "p", text: "When an equation has two operations, undo them in the reverse order of operations — handle addition/subtraction before multiplication/division." },
        { type: "example", q: "Solve 2x + 5 = 17.", a: "x = 6", steps: ["Subtract 5: 2x = 12", "Divide by 2: x = 6"] },
        { type: "example", q: "Solve (x/3) − 4 = 2.", a: "x = 18", steps: ["Add 4: x/3 = 6", "Multiply by 3: x = 18"] },
      ],
    },
    {
      id: "eq-3", topic: "equations", title: "Variables on Both Sides", difficulty: "Advanced", minutes: 8,
      summary: "Move all variables to one side and constants to the other.",
      body: [
        { type: "p", text: "When x appears on both sides of the equation, collect the variable terms on one side and the constants on the other, then solve." },
        { type: "example", q: "Solve 5x − 3 = 2x + 9.", a: "x = 4", steps: ["Subtract 2x: 3x − 3 = 9", "Add 3: 3x = 12", "Divide by 3: x = 4"] },
        { type: "callout", kind: "tip", title: "Check your answer", text: "Substitute your solution back into the original equation to verify both sides are equal." },
      ],
    },

    /* ===== INEQUALITIES ===== */
    {
      id: "ineq-1", topic: "inequalities", title: "Solving Linear Inequalities", difficulty: "Intermediate", minutes: 7,
      summary: "Like equations, but flip the sign when multiplying or dividing by a negative.",
      body: [
        { type: "p", text: "We solve inequalities much like equations, with one critical exception: when you multiply or divide both sides by a negative number, you must flip the inequality symbol." },
        { type: "formula", text: "\\text{If } a < b \\text{ and } c < 0, \\text{ then } ac > bc" },
        { type: "example", q: "Solve −2x > 6.", a: "x < −3", steps: ["Divide both sides by −2", "Because −2 is negative, flip >", "Result: x < −3"] },
        { type: "callout", kind: "warn", title: "Don't forget to flip!", text: "Forgetting to flip the sign when dividing by a negative is the most common inequality mistake." },
      ],
    },
    {
      id: "ineq-2", topic: "inequalities", title: "Graphing Inequalities", difficulty: "Intermediate", minutes: 6,
      summary: "Open vs. closed circles show whether the endpoint is included.",
      body: [
        { type: "p", text: "On a number line, we graph the solution of an inequality with a ray. Use an open circle ○ for < and > (endpoint not included), and a closed circle ● for ≤ and ≥ (endpoint included)." },
        { type: "ul", items: ["x > 3: open circle at 3, shade to the right", "x ≤ 5: closed circle at 5, shade to the left", "−2 < x ≤ 4: open at −2, closed at 4, shade between"] },
      ],
    },

    /* ===== FACTORING ===== */
    {
      id: "fact-1", topic: "factoring", title: "Greatest Common Factor", difficulty: "Beginner", minutes: 6,
      summary: "Factor out the largest common term from each part of an expression.",
      body: [
        { type: "p", text: "Factoring out the GCF is the reverse of the distributive property. Find the largest factor common to every term and pull it outside parentheses." },
        { type: "example", q: "Factor 6x + 9.", a: "3(2x + 3)", steps: ["GCF of 6 and 9 is 3", "6x = 3 · 2x, 9 = 3 · 3", "Result: 3(2x + 3)"] },
        { type: "example", q: "Factor 12x² + 18x.", a: "6x(2x + 3)", steps: ["GCF of 12 and 18 is 6; common variable x", "12x² = 6x · 2x, 18x = 6x · 3", "Result: 6x(2x + 3)"] },
      ],
    },
    {
      id: "fact-2", topic: "factoring", title: "Factoring Quadratics", difficulty: "Advanced", minutes: 9,
      summary: "Factor x² + bx + c by finding two numbers that multiply to c and add to b.",
      body: [
        { type: "p", text: "To factor x² + bx + c, look for two numbers that multiply to c and add to b. The factored form is (x + p)(x + q) where p + q = b and p · q = c." },
        { type: "formula", text: "x^2 + bx + c = (x + p)(x + q) \\text{ where } p+q=b,\\ p q=c" },
        { type: "example", q: "Factor x² + 7x + 12.", a: "(x + 3)(x + 4)", steps: ["Find two numbers that multiply to 12 and add to 7", "3 × 4 = 12 and 3 + 4 = 7", "Result: (x + 3)(x + 4)"] },
        { type: "example", q: "Factor x² − 5x + 6.", a: "(x − 2)(x − 3)", steps: ["Need two numbers that multiply to +6 and add to −5", "−2 × −3 = 6 and −2 + (−3) = −5", "Result: (x − 2)(x − 3)"] },
      ],
    },
    {
      id: "fact-3", topic: "factoring", title: "Difference of Squares", difficulty: "Advanced", minutes: 5,
      summary: "A special pattern: a² − b² = (a + b)(a − b).",
      body: [
        { type: "formula", text: "a^2 - b^2 = (a + b)(a - b)" },
        { type: "example", q: "Factor x² − 25.", a: "(x + 5)(x − 5)", steps: ["25 = 5², so this is a difference of squares", "Apply the pattern: (x + 5)(x − 5)"] },
        { type: "example", q: "Factor 4x² − 9.", a: "(2x + 3)(2x − 3)", steps: ["4x² = (2x)², 9 = 3²", "Apply the pattern: (2x + 3)(2x − 3)"] },
      ],
    },

    /* ===== EXPANDING ===== */
    {
      id: "exp-1", topic: "expanding", title: "Distributive Law", difficulty: "Beginner", minutes: 5,
      summary: "Multiply each term inside parentheses by the term outside.",
      body: [
        { type: "formula", text: "a(b + c) = ab + ac" },
        { type: "example", q: "Expand 4(x + 7).", a: "4x + 28", steps: ["4 · x = 4x", "4 · 7 = 28", "Result: 4x + 28"] },
      ],
    },
    {
      id: "exp-2", topic: "expanding", title: "Binomial Products", difficulty: "Intermediate", minutes: 8,
      summary: "Use FOIL to multiply two binomials: First, Outer, Inner, Last.",
      body: [
        { type: "p", text: "To multiply (a + b)(c + d), multiply each term in the first binomial by each term in the second. The FOIL mnemonic helps: First, Outer, Inner, Last." },
        { type: "formula", text: "(a+b)(c+d) = ac + ad + bc + bd" },
        { type: "example", q: "Expand (x + 3)(x + 5).", a: "x² + 8x + 15", steps: ["First: x · x = x²", "Outer: x · 5 = 5x", "Inner: 3 · x = 3x", "Last: 3 · 5 = 15", "Combine: x² + 8x + 15"] },
      ],
    },
    {
      id: "exp-3", topic: "expanding", title: "Perfect Square & Special Products", difficulty: "Advanced", minutes: 6,
      summary: "Memorize these patterns to expand faster.",
      body: [
        { type: "formula", text: "(a + b)^2 = a^2 + 2ab + b^2 \\\\[4pt] (a - b)^2 = a^2 - 2ab + b^2" },
        { type: "example", q: "Expand (x + 4)².", a: "x² + 8x + 16", steps: ["Use (a + b)² = a² + 2ab + b²", "a = x, b = 4", "x² + 2·x·4 + 16 = x² + 8x + 16"] },
      ],
    },

    /* ===== COORDINATE ===== */
    {
      id: "coord-1", topic: "coordinate", title: "The Coordinate Plane", difficulty: "Beginner", minutes: 6,
      summary: "Points are located by ordered pairs (x, y) on a grid.",
      body: [
        { type: "p", text: "The coordinate plane is formed by two perpendicular number lines: the horizontal x-axis and the vertical y-axis. Every point is identified by an ordered pair (x, y)." },
        { type: "ul", items: ["Origin: the point (0, 0) where axes meet", "Quadrants I, II, III, IV going counter-clockwise from top-right", "x-coordinate: how far right (positive) or left (negative)", "y-coordinate: how far up (positive) or down (negative)"] },
      ],
    },
    {
      id: "coord-2", topic: "coordinate", title: "Slope of a Line", difficulty: "Intermediate", minutes: 7,
      summary: "Slope measures steepness: rise over run.",
      body: [
        { type: "formula", text: "m = \\frac{\\text{rise}}{\\text{run}} = \\frac{y_2 - y_1}{x_2 - x_1}" },
        { type: "example", q: "Find the slope through (1, 2) and (4, 11).", a: "3", steps: ["m = (11 − 2) / (4 − 1)", "= 9 / 3 = 3"] },
        { type: "callout", kind: "tip", title: "Sign of the slope", text: "Positive slope: line rises left-to-right. Negative slope: line falls. Zero slope: horizontal. Undefined slope: vertical." },
      ],
    },
    {
      id: "coord-3", topic: "coordinate", title: "Distance & Midpoint", difficulty: "Intermediate", minutes: 7,
      summary: "Two essential formulas for any pair of points.",
      body: [
        { type: "formula", text: "d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2} \\\\[6pt] M = \\left( \\frac{x_1 + x_2}{2},\\ \\frac{y_1 + y_2}{2} \\right)" },
        { type: "example", q: "Find the distance between (1, 2) and (4, 6).", a: "5", steps: ["d = √((4−1)² + (6−2)²)", "= √(9 + 16) = √25 = 5"] },
        { type: "example", q: "Find the midpoint of (2, 4) and (6, 10).", a: "(4, 7)", steps: ["x: (2 + 6)/2 = 4", "y: (4 + 10)/2 = 7", "M = (4, 7)"] },
      ],
    },

    /* ===== GEOMETRY ===== */
    {
      id: "geo-1", topic: "geometry", title: "Perimeter & Area of Polygons", difficulty: "Beginner", minutes: 7,
      summary: "Perimeter is the distance around; area is the space inside.",
      body: [
        { type: "formula", text: "\\text{Rectangle: } P = 2(l+w),\\ A = lw \\\\[4pt] \\text{Triangle: } A = \\tfrac{1}{2} b h \\\\[4pt] \\text{Parallelogram: } A = bh" },
        { type: "example", q: "A rectangle is 8 by 5. Find its perimeter and area.", a: "P = 26, A = 40", steps: ["P = 2(8 + 5) = 2(13) = 26", "A = 8 × 5 = 40"] },
        { type: "example", q: "A triangle has base 10 and height 6. Find its area.", a: "30", steps: ["A = ½ · b · h", "= ½ · 10 · 6 = 30"] },
      ],
    },
    {
      id: "geo-2", topic: "geometry", title: "Circles: Area & Circumference", difficulty: "Intermediate", minutes: 6,
      summary: "Two formulas involving π that you'll use forever.",
      body: [
        { type: "formula", text: "C = 2\\pi r = \\pi d \\\\[4pt] A = \\pi r^2" },
        { type: "example", q: "A circle has radius 7. Find C and A (use π ≈ 3.14).", a: "C ≈ 43.96, A ≈ 153.86", steps: ["C = 2π(7) ≈ 43.96", "A = π(7²) = 49π ≈ 153.86"] },
      ],
    },
    {
      id: "geo-3", topic: "geometry", title: "Angles & Triangles", difficulty: "Intermediate", minutes: 7,
      summary: "Angles in a triangle always sum to 180°.",
      body: [
        { type: "p", text: "When two lines intersect, opposite (vertical) angles are equal, and adjacent angles on a straight line add to 180°. In any triangle, the three interior angles sum to 180°." },
        { type: "formula", text: "\\angle A + \\angle B + \\angle C = 180^\\circ" },
        { type: "example", q: "Two angles of a triangle are 50° and 60°. Find the third.", a: "70°", steps: ["Sum of given: 50 + 60 = 110", "Third = 180 − 110 = 70°"] },
      ],
    },

    /* ===== STATISTICS ===== */
    {
      id: "stat-1", topic: "statistics", title: "Mean, Median & Mode", difficulty: "Beginner", minutes: 7,
      summary: "Three ways to describe the center of a data set.",
      body: [
        { type: "ul", items: ["Mean: the average — sum of values divided by the count", "Median: the middle value when data is ordered", "Mode: the value that appears most often"] },
        { type: "example", q: "Find the mean of 4, 8, 6, 10, 2.", a: "6", steps: ["Sum = 4 + 8 + 6 + 10 + 2 = 30", "Count = 5", "Mean = 30 / 5 = 6"] },
        { type: "example", q: "Find the median of 3, 7, 9, 1, 5.", a: "5", steps: ["Order: 1, 3, 5, 7, 9", "Middle value = 5"] },
      ],
    },
    {
      id: "stat-2", topic: "statistics", title: "Range & Spread", difficulty: "Intermediate", minutes: 5,
      summary: "Range measures how spread out the data is.",
      body: [
        { type: "formula", text: "\\text{Range} = \\text{maximum} - \\text{minimum}" },
        { type: "example", q: "Find the range of 12, 4, 8, 15, 7.", a: "11", steps: ["Max = 15, Min = 4", "Range = 15 − 4 = 11"] },
      ],
    },
    {
      id: "stat-3", topic: "statistics", title: "Reading Charts & Graphs", difficulty: "Intermediate", minutes: 6,
      summary: "Bar charts, line graphs, and pie charts each tell a story.",
      body: [
        { type: "ul", items: ["Bar chart: compares categories", "Line graph: shows change over time", "Pie chart: shows parts of a whole (percentages)"] },
        { type: "callout", kind: "tip", title: "Always read the axes", text: "Before interpreting a graph, check the scale, units, and labels on both axes — misleading scales distort the truth." },
      ],
    },

    /* ===== PROBABILITY ===== */
    {
      id: "prob-1", topic: "probability", title: "What is Probability?", difficulty: "Beginner", minutes: 6,
      summary: "Probability measures how likely an event is, from 0 to 1.",
      body: [
        { type: "formula", text: "P(\\text{event}) = \\frac{\\text{favorable outcomes}}{\\text{total outcomes}}" },
        { type: "p", text: "A probability of 0 means the event is impossible; 1 means it is certain; 0.5 means a 50–50 chance." },
        { type: "example", q: "What is the probability of rolling a 4 on a fair 6-sided die?", a: "1/6", steps: ["Favorable outcomes: just {4} → 1", "Total outcomes: 6", "P = 1/6"] },
      ],
    },
    {
      id: "prob-2", topic: "probability", title: "Compound Events", difficulty: "Intermediate", minutes: 7,
      summary: "Multiply probabilities for 'and', add for mutually exclusive 'or'.",
      body: [
        { type: "p", text: "For independent events, the probability that both happen is the product of their probabilities." },
        { type: "formula", text: "P(A \\text{ and } B) = P(A) \\times P(B)" },
        { type: "example", q: "Flip two coins. What's P(both heads)?", a: "1/4", steps: ["P(heads) = 1/2 each", "P(both) = 1/2 × 1/2 = 1/4"] },
      ],
    },
    {
      id: "prob-3", topic: "probability", title: "Counting with Trees & Lists", difficulty: "Intermediate", minutes: 6,
      summary: "Systematic counting prevents missing or double-counting outcomes.",
      body: [
        { type: "p", text: "For small sample spaces, listing outcomes or drawing a tree diagram ensures you count each one exactly once." },
        { type: "formula", text: "\\text{If stage 1 has } m \\text{ options and stage 2 has } n,\\ \\text{total} = m \\times n" },
        { type: "example", q: "A menu has 3 sandwiches and 4 drinks. How many meal combos?", a: "12", steps: ["3 sandwiches × 4 drinks", "= 12 combinations"] },
      ],
    },
  ];

  function getTopic(id) { return TOPICS.find((t) => t.id === id); }
  function lessonsByTopic(topicId) { return LESSONS.filter((l) => l.topic === topicId); }
  function getLesson(id) { return LESSONS.find((l) => l.id === id); }
  function searchLessons(query) {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return LESSONS.filter((l) =>
      l.title.toLowerCase().includes(q) ||
      l.summary.toLowerCase().includes(q) ||
      l.topic.includes(q) ||
      (getTopic(l.topic)?.name.toLowerCase().includes(q))
    );
  }

  MM.topics = TOPICS;
  MM.lessons = LESSONS;
  MM.content = { getTopic, lessonsByTopic, getLesson, searchLessons };
})();
