import { type Concept } from './concepts';

export const principiaConcepts: Concept[] = [
  {
    id: 'laws-of-motion',
    slug: 'laws-of-motion',
    titleHe: 'Laws of Motion',
    titleEn: 'Axiomata, sive Leges Motus',
    chapterLabel: 'Book I — Axioms (Leges Motus)',
    chapterNumber: 1,
    layer1He:
      "The three Axiomata are deceptively familiar — but Newton's formulation is subtly different from what we teach today. Law II in the Principia reads: 'The change of motion is proportional to the motive force impressed; and is made in the direction of the right line in which that force is impressed.' This is F = dp/dt — not F = ma. Newton wrote in terms of momentum change, not acceleration. The distinction matters: it gives the correct result when mass is variable (rockets, fuel burn, chain mechanics), and it's the natural form from which Lagrangian and Hamiltonian mechanics emerge. The F = ma we learn first is a special case valid only for constant-mass systems.",
    layer3He:
      "The Corollaries to the Laws contain significant content often overlooked. Corollary I states the parallelogram law for force composition — vector addition, formalized before vector algebra existed. Corollary III gives conservation of momentum ('the quantity of motion... will not be changed by the action of bodies among themselves') — stated as a theorem, not a postulate. Corollary IV establishes that the common center of gravity of a system moves uniformly in a straight line — conservation of momentum for multi-body systems, 250 years before Noether's theorem formalized the symmetry argument. The Scholium following the Laws describes Newton's pendulum collision experiments with accuracy to 1 part in 1000, providing empirical grounding. Notably, Law I (inertia) is not merely a special case of Law II with F = 0; it defines what an inertial frame is — without it, Law II has no meaning.",
    parentGuideHe:
      "For systems and mechanical engineering: the Newton-Euler equations of rigid body dynamics extend these axioms to 6-DOF motion. Law II applied to angular momentum gives Euler's equations: τ = d(Iω)/dt. Variable-mass systems — rockets (Tsiolkovsky equation), chain mechanisms, conveyor belts — require the full F = dp/dt form; using F = ma gives wrong answers by omitting the dm/dt·v term. Modern spacecraft attitude control laws trace directly to Newton's three axioms plus Euler's extension. Law III ('action equals reaction') is frequently misapplied: it refers to forces between pairs of bodies, not to all forces in a system. In constrained multi-body systems, constraint forces appear to break Law III at the system level — D'Alembert's principle resolves this by treating inertial terms as effective forces.",
    parentPromptsHe: [
      'When does F = dp/dt give a different answer from F = ma? Identify three real engineering systems where the distinction matters.',
      'Corollary VI on relative motion in free-fall is the embryo of the equivalence principle. How does this connect to inertial frames in your dynamics experience?',
      'Newton validated his laws with pendulum collisions accurate to 1 in 1000. What would you identify as the dominant uncertainty sources in such an experiment — random or systematic?',
      'Law I defines inertia, Law II defines force quantitatively, Law III makes forces relational. Which of the three is most fundamental, and could the others be derived from it?',
    ],
    isAbstract: false,
    relatedConcepts: ['centripetal-force', 'fluid-resistance', 'absolute-space-time'],
    scientistIds: [],
    color: '#f59e0b',
    emoji: '⚖️',
    keyFacts: [
      'Newton wrote F = dp/dt, not F = ma — the momentum form is the general case',
      'Corollary III gives conservation of momentum as a theorem derived from the laws, not a postulate',
      'Law I is not redundant with Law II: it defines what an inertial reference frame is',
      'Newton validated the laws experimentally with pendulum collisions to 0.1% accuracy',
      "The parallelogram law for force composition (vector addition) appears in Corollary I — before vector mathematics existed",
    ],
    hawkingQuote:
      '"I have not been able to discover the cause of those properties of gravity from phenomena, and I frame no hypotheses." — on the nature of gravitational force, General Scholium',
    historyHe:
      'Galileo established inertia and kinematic free-fall (~1638). Descartes formulated conservation of "quantity of motion" (momentum) but incorrectly as scalar. Huygens corrected Descartes using elastic collision analysis (1656-1668). Newton synthesized and extended these into three universal axioms (1687). Euler later extended Newton to rigid body rotation (1736, 1760) and to continuum mechanics. D\'Alembert provided an alternative variational formulation (1743) which led to Lagrange (1788) and Hamilton (1833) — the same three laws, expressed in increasingly abstract and general mathematical frameworks.',
    scientistsHe:
      'Galileo Galilei — inertia and kinematics without a force concept. René Descartes — conservation of scalar momentum. Christiaan Huygens — correct elastic collision theory. Isaac Newton — the three universal laws (1687). Leonhard Euler — extension to rigid body and continuum mechanics. Joseph-Louis Lagrange — variational formulation equivalent to Newton\'s laws.',
    funFactHe:
      "Newton wrote the Principia in 18 months (1685–1686), driven partly by a bet: Halley and Hooke were arguing about whether an inverse-square force law implied elliptical orbits. Newton said he'd calculated it years earlier, went home to find the proof, couldn't find it, and rewrote it — leading eventually to the entire Principia.",
    numbersHe: [
      { label: 'Accuracy of pendulum collision experiments', value: '0.1%' },
      { label: 'Corollaries to the Three Laws', value: '6' },
      { label: 'Year of publication', value: '1687' },
      { label: 'Special case: F = ma valid when', value: 'dm/dt = 0' },
    ],
    bookExamplesHe: [
      {
        title: 'The Rocket Problem',
        text: "A rocket burns fuel at rate ṁ = dm/dt. Using F = dp/dt: F_thrust = v_exhaust · |ṁ| + m·a. Using F = ma incorrectly misses the v_exhaust·|ṁ| term — Tsiolkovsky's rocket equation (Δv = v_e · ln(m₀/m_f)) follows directly from F = dp/dt, not F = ma.",
      },
      {
        title: 'The Parallelogram (Corollary I)',
        text: "Newton proves that two forces acting simultaneously produce the same motion as a single diagonal force — modern vector addition. He uses a geometric construction predating the formal concept of vectors by 150 years. It's the first statement of the superposition principle for forces.",
      },
      {
        title: "What Newton Meant by 'Quantity of Motion'",
        text: "Newton defines 'quantity of motion' as mass × velocity (momentum) in Definition II, before stating the laws. So Law II is literally: 'rate of change of (mass × velocity) = applied force' — unambiguously F = dp/dt. The modern F = ma restatement requires the additional assumption of constant mass.",
      },
    ],
  },

  {
    id: 'absolute-space-time',
    slug: 'absolute-space-time',
    titleHe: 'Absolute Space and Time',
    titleEn: 'Scholium to the Definitions',
    chapterLabel: 'Book I — Scholium (Definitions)',
    chapterNumber: 2,
    layer1He:
      "The Scholium to the Definitions is one of the most consequential — and contested — passages in the history of science. Newton asserted: 'Absolute, true, and mathematical time, of itself, and from its own nature, flows equably without regard to anything external.' Similarly: 'Absolute space, in its own nature, without regard to anything external, remains always similar and immovable.' These were metaphysical scaffolding — Newton needed them to define inertial frames before his laws could be stated. His rotating bucket experiment was the empirical argument: spin a bucket of water; the paraboloid water surface cannot be explained by motion relative to the bucket — it reveals motion relative to something absolute.",
    layer3He:
      "The bucket argument: fill a bucket with water, spin it, wait for the water to co-rotate. The water surface curves into a paraboloid. If motion is purely relative (Leibniz's view), the water is stationary relative to the bucket at this point, so the surface should be flat — but it isn't. It curves because of rotation relative to absolute space. This argument troubled physicists for 250 years. Ernst Mach (1883) responded: rotation is meaningful relative to the distant stars. Einstein incorporated Mach's principle into General Relativity: spacetime curvature is determined by matter distribution, and inertia has meaning only relative to the global mass distribution. Today we know Newton was wrong about absolute space — but the bucket correctly identified that rotation is not purely relative. It has objective, measurable effects. GR's answer: acceleration is relative to local geodesics determined by the metric tensor, not to fixed absolute space.",
    parentGuideHe:
      "For an engineer: this is the foundation of the inertial frame question. Newton's absolute space is replaced in practice by 'inertial frames' — frames where the laws of physics take their standard form. In IMU design, gyroscopes measure rotation relative to the local inertial frame (essentially relative to the fixed stars, over short timescales). GPS systems apply both special and general relativistic corrections to clock rates — the very corrections that prove Newton's absolute time is wrong: clocks in GPS satellites run faster by ~38 microseconds/day due to both SR (speed effect, −7 μs/day) and GR (altitude/gravity effect, +45 μs/day). Without correction, GPS would accumulate ~11 km/day of position error. Newton's absolute space was the engineering approximation that worked brilliantly for 230 years until GPS-level precision demanded relativistic corrections.",
    parentPromptsHe: [
      'Newton needed absolute space to define non-rotating (inertial) frames. What does modern physics use instead, and how is it operationally defined?',
      'The GPS relativistic correction is 38 μs/day from Newtonian mechanics. Walk through the SR and GR contributions separately — which dominates, and why?',
      "Mach's principle says inertia is defined by the global mass distribution. Has this been tested experimentally? What would a universe with different mass distribution imply for local physics?",
      'In spacecraft attitude dynamics (attitude control of a satellite), how is the inertial reference frame established in practice?',
    ],
    isAbstract: true,
    relatedConcepts: ['laws-of-motion', 'method-of-ratios'],
    scientistIds: [],
    color: '#d97706',
    emoji: '🕰️',
    keyFacts: [
      "Newton's absolute time was disproved by Einstein's SR (1905): time dilation is real and measurable",
      "GPS satellites require relativistic corrections of 38 μs/day — pure Newtonian mechanics fails at this precision",
      'The bucket experiment correctly showed rotation is not purely relative — GR explains this via spacetime curvature',
      "Leibniz's relational alternative to absolute space was philosophically compelling but lacked Newton's predictive mathematical framework",
      "Mach's principle influenced Einstein's development of GR but is not fully incorporated in GR as currently formulated",
    ],
    hawkingQuote:
      '"Absolute space, in its own nature, without regard to anything external, remains always similar and immovable. Relative space is some movable dimension or measure of the absolute spaces." — Scholium to the Definitions',
    historyHe:
      'Descartes held a purely relational view of space: extension is matter, and motion is only relative. Leibniz agreed: space is merely the order of co-existing things, and time the order of successive things. Newton rejected this with the bucket argument (1687). Bishop Berkeley (1710) critiqued Newton: absolute space is unobservable and therefore meaningless. Mach (1883) developed the relational critique quantitatively. Einstein (1905) disposed of absolute time with SR; GR (1915) replaced absolute space with the dynamical spacetime metric, partially vindicating Mach.',
    scientistsHe:
      'René Descartes — relational space, extension = matter. Gottfried Leibniz — relational space and time, Leibniz-Clarke correspondence. George Berkeley — early philosophical critique of absolute space. Ernst Mach — quantitative relational critique, Mach\'s principle. Albert Einstein — SR disposes of absolute time; GR replaces absolute space with dynamical spacetime.',
    funFactHe:
      "The GPS relativistic correction is not a theoretical curiosity — it's implemented in the satellite firmware. When GPS was first designed, some engineers wanted to launch without relativistic corrections to 'see if they were needed.' They were outvoted. Without the corrections, GPS would be useless within hours.",
    numbersHe: [
      { label: 'GPS SR time correction (speed effect)', value: '−7 μs/day' },
      { label: 'GPS GR time correction (gravity/altitude)', value: '+45 μs/day' },
      { label: 'Net GPS relativistic correction', value: '+38 μs/day' },
      { label: 'Position error without correction', value: '~11 km/day' },
    ],
    bookExamplesHe: [
      {
        title: "Newton's Rotating Bucket",
        text: "Phase 1: bucket stationary, water stationary — surface flat. Phase 2: bucket spinning, water not yet spinning (relative motion exists) — surface still flat. Phase 3: water co-rotating with bucket (no relative motion) — surface curved paraboloid. The curvature occurs in Phase 3 when there's no relative motion between water and bucket. What causes it? Newton: rotation relative to absolute space. Mach/Einstein: rotation relative to the global inertial frame defined by distant matter.",
      },
      {
        title: 'The Two-Globe Experiment',
        text: "Newton proposed: take two globes connected by a cord in empty space with no external reference points. If you rotate them, the cord will be tensioned — but how would you know they're rotating? Newton: by the tension itself — rotation relative to absolute space is physically meaningful. Mach: with no external reference, the concept of rotation is meaningless. Einstein: the tension is real, but it's rotation relative to the spacetime metric (which is determined by all the matter in the universe).",
      },
    ],
  },

  {
    id: 'method-of-ratios',
    slug: 'method-of-ratios',
    titleHe: 'Method of First and Last Ratios',
    titleEn: 'Lemmas I–XI, Book I Section I',
    chapterLabel: 'Book I — Section I (Mathematical Lemmas)',
    chapterNumber: 3,
    layer1He:
      "Before writing the Principia Newton needed a mathematical language for instantaneous rates of change — what we now call calculus. His approach: the 'Method of First and Last Ratios' — the limiting ratio of vanishing quantities. Rather than infinitesimals (which he found philosophically suspect), Newton argued from ratios of geometrically vanishing figures. Lemma I: 'Quantities, and the ratios of quantities, which in any finite time converge continually to equality, and before the end of that time approach nearer to each other than by any given difference, are ultimately equal.' This is the limit concept — stated geometrically, 20 years before Leibniz published his differential calculus notation (1684). Newton had developed his 'method of fluxions' around 1665–66 but presented it geometrically in the Principia for classical rigor.",
    layer3He:
      "Newton and Leibniz developed calculus independently and nearly simultaneously. Newton's 'fluxions' (~1665–66, published 1704); Leibniz's differentials (1684 publication). Newton's dot notation (ẋ for dx/dt) persists in mechanics; Leibniz's dy/dx notation dominates everywhere else. The priority dispute poisoned British mathematics for a century — English mathematicians stubbornly used Newton's notation while continental Europe advanced with Leibniz's more powerful notation. Newton deliberately wrote the Principia in classical geometric style (like Euclid's Elements) for rigor by contemporary standards, having privately used his fluxional calculus to discover the results, then translated them into geometric proofs. The true rigorous foundation for calculus wasn't established until Cauchy, Weierstrass, and Dedekind in the 19th century — but Newton's 'first and last ratios' is recognizably the limit concept.",
    parentGuideHe:
      "From a numerical methods perspective: Newton was grappling with the same discretization issue that confronts every FEA or CFD practitioner. His 'first and last ratios' is the theoretical justification for why finite differences converge to derivatives as step size → 0. The practical question of how small is small enough — truncation error vs round-off error — is Newton's limit concept made computational. Newton also invented Newton's method (iterative root-finding), Newton-Cotes quadrature, the binomial series generalization, and numerous other computational tools. In control systems, the continuous-time vs discrete-time distinction is exactly this question made practical: z-domain discretization is Newton's geometric limit made algebraic. Interesting aside: Newton discovered calculus for physics but chose to present the Principia geometrically — analogous to deriving a result in Simulink but writing the report in transfer function notation.",
    parentPromptsHe: [
      'Newton chose geometric proofs over his own calculus notation for the Principia — presumably for rigor and audience. What engineering communication tradeoff does this illustrate?',
      'The Lemma sequence (I–XI) builds up the tools needed for orbital mechanics proofs. How does this compare to building a mathematical framework before an engineering derivation?',
      'Newton discovered calculus ~1665 but published it only in 1704 (when the Leibniz priority dispute forced his hand). What are the professional ethics of delayed publication of scientific results?',
      'Lemma II proves that the area swept by a radius vector equals the area under a polygon that converges to the curve. Is this approach rigorous by modern standards? What would be needed to make it so?',
    ],
    isAbstract: true,
    relatedConcepts: ['laws-of-motion', 'centripetal-force'],
    scientistIds: [],
    color: '#ea580c',
    emoji: '∞',
    keyFacts: [
      'Newton invented calculus ~1665 but wrote the Principia using geometric proofs for classical rigor',
      'Leibniz published his calculus notation in 1684 — Newton published his in 1704, sparking a bitter priority dispute',
      'The limit concept (Lemma I) is stated geometrically, not analytically — recognizable as the modern ε-δ definition in embryonic form',
      'English mathematics stagnated for a century by insisting on Newton\'s dot notation over Leibniz\'s superior dy/dx',
      "Newton also invented Newton's method, Newton-Cotes integration, the generalized binomial theorem, and power series for sin/cos/ln",
    ],
    hawkingQuote:
      '"By the ultimate ratio of evanescent quantities is to be understood the ratio of the quantities not before they vanish, nor afterwards, but with which they vanish." — Scholium to Lemma XI',
    historyHe:
      'Archimedes used the method of exhaustion (limits of polygonal approximations) to compute areas and volumes (~250 BC). Cavalieri developed indivisibles (1635). Fermat computed maxima/minima using vanishing increments (1629). Newton developed fluxions (~1665–66). Leibniz developed differentials (1675, published 1684). Berkeley attacked both with "The Analyst" (1734): "ghosts of departed quantities." Cauchy provided the first rigorous limit definition (1821). Weierstrass gave the ε-δ definition (1861). Robinson put infinitesimals on rigorous footing with non-standard analysis (1960).',
    scientistsHe:
      'Archimedes — method of exhaustion. Bonaventura Cavalieri — method of indivisibles. Pierre de Fermat — maxima via vanishing increments. Isaac Newton — fluxions and first/last ratios. Gottfried Leibniz — differential and integral calculus notation. Augustin-Louis Cauchy — rigorous limit definition. Karl Weierstrass — ε-δ formalization.',
    funFactHe:
      "Newton's calculus priority dispute with Leibniz was adjudicated by the Royal Society in 1713 — with Newton himself secretly writing the committee's report finding in his own favor. It remains one of the most egregious conflicts of interest in the history of science.",
    numbersHe: [
      { label: "Newton's fluxions developed", value: '~1665–66' },
      { label: 'Leibniz notation published', value: '1684' },
      { label: 'Newton notation published', value: '1704' },
      { label: 'Rigorous ε-δ definition', value: '1861' },
    ],
    bookExamplesHe: [
      {
        title: 'Lemma I — The Core Idea',
        text: "Two quantities converging toward equality: if they always differ by less than any prescribed positive amount after some finite time T, they are ultimately equal. This is Cauchy's definition of a limit, stated 134 years early — but geometrically rather than analytically. Newton applies this to the ratio of a chord to an arc as the chord vanishes: the ratio approaches 1, giving the tangent direction.",
      },
      {
        title: "Newton's Method vs. The Principia",
        text: "Newton likely discovered his orbital results using fluxional calculus privately (notes survive from ~1666). He then rewrote the proofs geometrically for publication. This dual-mode working — calculus for discovery, geometry for communication — is analogous to a modern engineer who derives results in MATLAB/Simulink but documents them in block-diagram notation for a design review.",
      },
    ],
  },

  {
    id: 'centripetal-force',
    slug: 'centripetal-force',
    titleHe: 'Centripetal Force & Orbital Mechanics',
    titleEn: 'Propositions I–XVII, Book I Sections II–III',
    chapterLabel: 'Book I — Sections II–III (Orbits)',
    chapterNumber: 4,
    layer1He:
      "Book I, Sections II–III contain perhaps the greatest mathematical accomplishment in the Principia: the derivation of Kepler's three laws from first principles. Kepler had stated these laws empirically (1609–1619) with no physical explanation. Newton proved: (1) Any central force directed toward a fixed point causes a body to sweep equal areas in equal times — Kepler's Second Law follows from the parallelogram law alone, with no specific force law required. (2) If the force is inverse-square (F ∝ 1/r²), the orbit is a conic section (Kepler's First Law). (3) T² ∝ a³ follows from the inverse-square law combined with the area law (Kepler's Third Law). The synthesis unified planetary astronomy with mechanics.",
    layer3He:
      "Proposition XI: 'If a body revolves in an ellipse, it is required to find the law of centripetal force tending to the focus.' Newton shows the force must be ∝ 1/r². The proof uses ellipse geometry — specifically the relationship between the radius vector and the chord of curvature. Proposition XVII inverts the question: given 1/r² force, what is the orbit? Answer: any conic section (ellipse E < 0, parabola E = 0, hyperbola E > 0) with the force center at one focus. This is the complete Kepler problem solution. The vis-viva equation (v² = GM(2/r − 1/a)) is implicit throughout — the constant total energy partitioned between kinetic and potential. Newton also proved the Shell Theorem (Propositions 71–76): a uniform spherical shell exerts zero net force inside it, and acts as a point mass at its center for external bodies. This is why g = GM/R² at Earth's surface is exact for a spherical Earth — proved using his fluxional calculus disguised as geometric lemmas.",
    parentGuideHe:
      "This is the mathematical foundation of astrodynamics. For spacecraft trajectory design: the conic sections are the fundamental solutions. Elliptical orbits (satellites, T = 2π√(a³/GM)), parabolic escape trajectories (minimum-energy escape, v_esc = √(2GM/r)), hyperbolic fly-bys (Voyager's grand tour). The vis-viva equation is essential for Δv calculations in every orbital maneuver. The orbit-determination inverse problem — given observed positions and velocities, determine orbital elements — is used continuously in mission operations. For GPS: all 30+ satellites must maintain precise orbital parameters because orbital periods are extremely sensitive to semi-major axis (T ∝ a^(3/2)), and clock stability requires predictable orbital mechanics. The Shell Theorem is why you can model Earth as a point mass for most external calculations — a non-obvious result that Newton proved rigorously.",
    parentPromptsHe: [
      'The area law (Kepler II) follows from angular momentum conservation alone — no force law is needed. What symmetry does this correspond to in Noether\'s theorem framework?',
      'For a Hohmann transfer from LEO to GEO: use vis-viva to compute the two Δv burns. How does this connect to Newton\'s derivation of orbital energy from the inverse-square law?',
      "Newton's Shell Theorem proves that Earth's gravitational field outside is that of a point mass. What happens when Earth's oblateness is included — and how does the J₂ term affect satellite orbits?",
      'The inverse-square law produces closed (returning) orbits. Bertrand\'s theorem says only 1/r² and r (harmonic) force laws produce closed orbits. Why does this matter for the stability of the solar system?',
    ],
    isAbstract: false,
    relatedConcepts: ['laws-of-motion', 'universal-gravitation', 'moon-test'],
    scientistIds: [],
    color: '#eab308',
    emoji: '🪐',
    keyFacts: [
      "Kepler's three empirical laws (1609–1619) are all derived from Newton's single inverse-square force law",
      'The area law (equal areas in equal times) requires only a central force — no specific force law',
      'The vis-viva equation v² = GM(2/r − 1/a) gives orbital speed at any point from energy conservation',
      'The Shell Theorem: a spherical shell exerts zero net gravitational force on any interior point',
      'Orbit type (ellipse/parabola/hyperbola) is determined solely by total energy (E < 0, = 0, > 0)',
    ],
    hawkingQuote:
      '"That the areas which revolving bodies describe by radii drawn to an immovable centre of force do lie in the same immovable planes, and are proportional to the times in which they are described." — Proposition I (area law)',
    historyHe:
      "Copernicus proposed heliocentrism (1543). Brahe collected 20 years of precise naked-eye planetary data. Kepler discovered his three laws empirically from Brahe's data (1609, 1619). Galileo showed freely falling bodies follow parabolic paths. Hooke, Halley, and Wren suspected an inverse-square law but couldn't derive orbital shapes from it. Newton derived elliptic orbits from 1/r² (1687). Euler, Lagrange, and Laplace extended this to perturbation theory and N-body problems. Gauss derived asteroid Ceres' orbit from three observations (1801).",
    scientistsHe:
      "Johannes Kepler — three empirical laws of planetary motion. Galileo Galilei — parabolic free-fall trajectories. Robert Hooke — suspected 1/r² law, couldn't prove it. Edmond Halley — motivated Newton to write the Principia, applied it to comets. Isaac Newton — derived Kepler's laws from mechanics. Leonhard Euler — analytical orbital mechanics. Carl Friedrich Gauss — orbit determination from minimal observations.",
    funFactHe:
      "Newton's derivation of the area law (Proposition I) uses just the parallelogram law — no calculus, no specific force law. It's arguably the most elegant proof in the Principia: a sequence of triangular impulses converging to continuous motion. The area stays constant because the force has no tangential component — a geometric proof of angular momentum conservation.",
    numbersHe: [
      { label: 'ISS orbital altitude', value: '~408 km, a = 6786 km' },
      { label: 'ISS orbital speed (vis-viva)', value: '7.66 km/s' },
      { label: 'GEO orbital radius', value: '42,164 km' },
      { label: 'GEO orbital speed', value: '3.07 km/s' },
    ],
    bookExamplesHe: [
      {
        title: 'The Area Law Proof (Prop. I)',
        text: 'Newton approximates continuous orbital motion as a series of instantaneous impulses. Between impulses, the body moves in straight lines. Each triangular area swept (base × height / 2) remains constant because the impulse is central — it changes only the radial velocity, not the angular momentum. As the impulse interval → 0, the polygon becomes the smooth orbit. This is the parallelogram law used to prove conservation of angular momentum geometrically.',
      },
      {
        title: 'Ellipse → Inverse Square (Prop. XI)',
        text: 'Given: body in elliptical orbit with force center at focus F. Find: force law. Newton constructs the chord of curvature at each point P and shows its length varies as r². Since centripetal acceleration = v²/(chord of curvature) × geometric factor, and v² follows from the area law, the force ∝ 1/r². It is a beautiful geometric inverse problem — given the trajectory, recover the force law.',
      },
      {
        title: 'The Shell Theorem (Props. 71–76)',
        text: 'A spherical shell of uniform density: any interior point is pulled equally in all directions (by symmetry arguments using the inverse-square law), resulting in exactly zero net force. An exterior point: the entire shell acts as a point mass at its center. This allows Earth to be modeled as a point mass at its center for external gravity — a non-trivial result that Newton proved with his geometric calculus.',
      },
    ],
  },

  {
    id: 'universal-gravitation',
    slug: 'universal-gravitation',
    titleHe: 'Universal Gravitation',
    titleEn: 'Propositions IV–VII, Book III',
    chapterLabel: 'Book III — Proposition VII (Universal Law)',
    chapterNumber: 5,
    layer1He:
      "Newton's law of universal gravitation (Book III, Proposition VII): 'There is a power of gravity pertaining to all bodies, proportional to the several quantities of matter which they contain.' F = Gm₁m₂/r². The word 'universal' is the revolutionary claim — the same force that pulls a stone earthward governs the Moon's orbit, planetary motions, the tides, and the shape of the Earth itself. Since Aristotle, celestial and terrestrial physics were considered fundamentally different. Newton unified them. The gravitational constant G was not measured by Newton — Cavendish did this in 1798 with a torsion balance, 71 years after Newton's death. Newton worked only with dimensionless ratios of gravitational parameters (GM), not G and M separately.",
    layer3He:
      "Book III proceeds methodically. Propositions I–IV: the Moon's centripetal acceleration matches terrestrial gravity extended by the inverse-square law to lunar distance (to within ~1%). Propositions V–VII: Jupiter's and Saturn's moons obey Kepler's Third Law, as do the planets around the Sun — the same 1/r² law governs all. Proposition VI (crucial): 'The force of gravity towards the several equal particles of any body is inversely as the square of the distance of places from the particles.' And: the gravitational and inertial masses of any body are equal to one another (confirmed by pendulum experiments to 1 in 1000). This equivalence of gravitational and inertial mass — casually established as an experimental result — became Einstein's equivalence principle and the foundation of General Relativity 228 years later.",
    parentGuideHe:
      "For engineering: the gravitational parameter GM is the most precisely known quantity in astrodynamics — for Earth, GM = 3.986004418 × 10¹⁴ m³/s² (known to ~15 significant figures). G itself is only known to ~5 significant figures — the least precisely measured fundamental constant, still an active metrological problem. This matters: spacecraft navigation uses GM directly, never G and M separately. Modern satellite geodesy (GRACE, GRACE-FO) maps gravitational anomalies by measuring deviations from the idealized point-mass field — mapping ocean floor topography, ice sheet mass, and groundwater depletion. The geopotential model (EGM2008: spherical harmonics to degree 2190) is the descendant of Newton's universal gravitation — the same physics, with 2190 × 2192 / 2 ≈ 2.4 million additional terms for Earth's actual mass distribution.",
    parentPromptsHe: [
      'Newton proved gravitational and inertial mass are equal to 1 in 1000 using pendulums. Modern equivalence principle tests reach 1 in 10¹⁴. What are the experimental techniques behind this improvement?',
      'G is known to only ~5 significant figures while GM is known to ~15. Why is this discrepancy so large, and what does it imply for the measurability of the Planck mass?',
      'The GRACE satellites measured groundwater depletion in the Central Valley by detecting gravitational anomalies of order 10⁻⁸ g. What does this imply about the sensitivity of the spacecraft-to-spacecraft ranging?',
      "Newton's 'action at a distance' was philosophically troubling even to Newton himself. How did the concept of gravitational potential and field theory (Poisson equation: ∇²Φ = 4πGρ) address this?",
    ],
    isAbstract: false,
    relatedConcepts: ['centripetal-force', 'moon-test', 'figure-of-earth'],
    scientistIds: [],
    color: '#b45309',
    emoji: '🍎',
    keyFacts: [
      'F = Gm₁m₂/r² — gravitational force proportional to both masses, inversely proportional to distance squared',
      'G was not measured by Newton; Cavendish measured it in 1798 with a torsion balance',
      'GM (gravitational parameter) is known to 15 significant figures; G alone only to 5',
      'Equivalence of gravitational and inertial mass — proved by Newton to 0.1%, confirmed by Eötvös to 10⁻⁹, by MICROSCOPE to 10⁻¹⁵',
      "Newton was troubled by 'action at a distance' himself — he called it 'absurd' in private correspondence",
    ],
    hawkingQuote:
      '"That there is a power of gravity pertaining to all bodies, proportional to the several quantities of matter which they contain." — Proposition VII, Book III',
    historyHe:
      "Kepler suspected a solar force but thought it tangential. Hooke proposed inverse-square gravity (1674) without proof. Halley, Hooke, and Wren couldn't derive ellipses from it. Newton derived the inverse-square law from lunar/planetary data and proved orbits follow (1687). Cavendish measured G (1798). Poisson reformulated as potential theory: ∇²Φ = 4πGρ (1813). Einstein replaced Newtonian gravity with GR spacetime curvature (1915). Equivalence principle tests: Eötvös (1909), Dicke (1964), Braginsky (1972), MICROSCOPE satellite (2017).",
    scientistsHe:
      "Robert Hooke — proposed 1/r² gravity, couldn't prove orbital consequence. Edmond Halley — motivated Newton, applied to comets. Isaac Newton — universal gravitation from first principles. Henry Cavendish — measured G (1798). Siméon Denis Poisson — gravitational potential theory. Albert Einstein — replaced with GR spacetime curvature.",
    funFactHe:
      "The apple story is probably true but heavily embellished. Newton's own account (recorded by Stukeley, 1726): sitting in a garden, an apple fell, and it occurred to him that the force governing the apple might extend to the Moon. The key insight wasn't that gravity exists — everyone knew that — but that it might extend to astronomical distances following the same law.",
    numbersHe: [
      { label: 'G (gravitational constant)', value: '6.674 × 10⁻¹¹ m³/(kg·s²)' },
      { label: 'GM_Earth (gravitational parameter)', value: '3.986 × 10¹⁴ m³/s²' },
      { label: 'Precision of G', value: '~22 ppm (5 sig figs)' },
      { label: 'Precision of GM_Earth', value: '~1 ppb (15 sig figs)' },
    ],
    bookExamplesHe: [
      {
        title: "Why Cavendish, Not Newton, Measured G",
        text: "Newton could measure GM for any gravitational body from orbital mechanics — but separating G from M requires knowing the mass M by an independent method. Cavendish's torsion balance measured the gravitational force between two known laboratory masses, giving G directly. This then allowed back-calculation of Earth's mass: M_Earth = GM_Earth / G ≈ 5.97 × 10²⁴ kg. Cavendish titled his 1798 paper 'Weighing the Earth' — not 'Measuring G.'",
      },
      {
        title: 'Action at a Distance',
        text: "Newton himself was deeply uncomfortable with the concept of gravity acting instantaneously across empty space with no medium: 'That one body may act upon another at a distance through a vacuum without the mediation of anything else... is to me so great an absurdity that I believe no man who has in philosophical matters a competent faculty of thinking can ever fall into it.' His solution: 'I feign no hypotheses' (hypotheses non fingo) — he described the law mathematically without claiming to explain the mechanism.",
      },
    ],
  },

  {
    id: 'moon-test',
    slug: 'moon-test',
    titleHe: 'The Moon Test',
    titleEn: 'Proposition IV, Book III',
    chapterLabel: 'Book III — Proposition IV (Empirical Validation)',
    chapterNumber: 6,
    layer1He:
      "Proposition IV of Book III is Newton's famous 'Moon Test' — perhaps the most elegant quantitative verification in the Principia. He compared two measurements: (1) gravitational acceleration at Earth's surface: g ≈ 9.8 m/s², measurable with pendulums; (2) centripetal acceleration of the Moon in its orbit, calculated from its orbital radius and period. If gravity follows an inverse-square law, the Moon (at ~60 Earth-radii) should have acceleration g/60² = g/3600 ≈ 0.00272 m/s². Newton computed the Moon's centripetal acceleration from orbit: a = (2πr/T)²/r ≈ 0.00272 m/s². The agreement confirmed the 1/r² law connected terrestrial and celestial gravity.",
    layer3He:
      "Newton's first attempt (~1666) failed because he used an inaccurate Earth radius. He revised the calculation in 1685 using Picard's precise circumference measurement (1671). The calculation: Moon's mean distance r = 60.27 × R_Earth = 384,400 km. Orbital period T = 27.32 days. Centripetal acceleration: a = 4π²r/T² = 4π² × (3.844×10⁸) / (2.360×10⁶)² = 0.002726 m/s². Terrestrial g = 9.81 m/s². Ratio: 9.81 / 0.002726 = 3598 ≈ 60² = 3600. The ~0.05% agreement confirmed the 1/r² law to high precision. Proposition IV also implicitly proves the equivalence of gravitational and inertial mass: the Moon falls at the same rate regardless of its composition. This equivalence principle — barely noted by Newton — became Einstein's central postulate for General Relativity 230 years later.",
    parentGuideHe:
      "This is the paradigmatic dimensional analysis and model validation methodology. For astrodynamics engineers: this exact approach is used to measure gravitational parameters of bodies during spacecraft fly-bys. Measure the spacecraft trajectory deflection → infer GM of the body, without ever measuring mass and G separately. For the Pioneer anomaly: Pioneers 10/11 showed a small anomalous deceleration (~8.74 × 10⁻¹⁰ m/s²). For years, this was investigated as a potential modification of gravity at long range. The resolution (2012): thermal radiation pressure from onboard electronics — a non-gravitational force of the same magnitude. The Moon Test methodology — predict from scaling law, verify against measurement, identify discrepancy sources — is the same diagnostic process used for the Pioneer anomaly investigation.",
    parentPromptsHe: [
      "Newton's 1666 Moon Test failed due to inaccurate Earth radius. He didn't publish until 1685. What does this tell you about the relationship between theoretical frameworks and measurement precision in engineering validation?",
      'The Moon Test gives GM_Earth from the orbital period and radius. What is the modern equivalent — how do we determine GM for other solar system bodies (Mars, Jupiter) from spacecraft data?',
      'The Moon test confirmed 1/r² to ~0.05%. Modern lunar laser ranging confirms it to ~10⁻¹³. What phenomena would violate the 1/r² law, and what would they imply physically?',
      'The equivalence of gravitational and inertial mass is implicit in the Moon Test. Newton noted it but didn\'t emphasize it. Why was this not recognized as a profound principle until Einstein?',
    ],
    isAbstract: false,
    relatedConcepts: ['universal-gravitation', 'centripetal-force', 'figure-of-earth'],
    scientistIds: [],
    color: '#a16207',
    emoji: '🌙',
    keyFacts: [
      "Moon's centripetal acceleration: 0.00272 m/s² — matches g/60² = 0.00272 m/s² to within 0.05%",
      "Newton's first attempt (1666) failed due to inaccurate Earth radius; succeeded in 1685 after Picard's geodesy",
      'The Moon Test implicitly proves equivalence of gravitational and inertial mass — Einstein\'s foundational principle for GR',
      'Modern lunar laser ranging verifies the 1/r² law to 1 part in 10¹³',
      "The Moon is 'falling' toward Earth at 1.37 mm/s² — but its orbital velocity keeps it continuously missing Earth",
    ],
    hawkingQuote:
      '"And this calculus being applied to the moon, it appeared that the force requisite to keep the moon in her orb was to the force of gravity at the surface of the earth, as one to sixty square; that is, as one to 3600." — Newton\'s account in his Memorandum',
    historyHe:
      "Galileo showed all bodies fall at the same rate (equivalence principle experimentally established, 1630s). Newton's first Moon Test (~1666) failed — used 60 miles/degree for Earth circumference instead of 69. Picard measured Earth accurately (1671). Newton revised the calculation (1685): agreement confirmed. Published in Principia (1687). Eötvös tested equivalence of gravitational and inertial mass to 1 in 10⁸ (1889). Modern lunar laser ranging: Apollo retroreflectors confirm 1/r² to 1 in 10¹³.",
    scientistsHe:
      "Galileo Galilei — equivalence principle experimentally established (all bodies fall equally). Jean Picard — precise Earth circumference measurement (1671). Isaac Newton — Moon Test confirmation (1685, published 1687). Roland von Eötvös — high-precision equivalence principle test (1889). APOLLO experiment — modern lunar laser ranging.",
    funFactHe:
      "The Moon is falling toward Earth at the same rate a cannon ball would — but because it's moving sideways at 1 km/s, it keeps missing. Newton illustrated this with his famous 'cannon on a mountaintop' thought experiment in the System of the World: fire a cannon horizontally; with enough velocity, the ball 'falls' in a circle matching Earth's curvature. This is the same conceptual leap as the Moon Test.",
    numbersHe: [
      { label: "Moon's orbital radius", value: '384,400 km (60.27 R_Earth)' },
      { label: "Moon's orbital period", value: '27.32 days' },
      { label: "Moon's centripetal acceleration", value: '0.002726 m/s²' },
      { label: 'Agreement with g/3600', value: '< 0.05%' },
    ],
    bookExamplesHe: [
      {
        title: 'The Scaling Argument',
        text: "Surface: g = GM/R² ≈ 9.81 m/s². Moon (at r = 60R): a = GM/(60R)² = g/3600. From orbital data: a = 4π²r/T² = 4π²(3.844×10⁸)/(2.360×10⁶)² = 0.002726 m/s². From scaling: g/3600 = 9.81/3600 = 0.002725 m/s². Agreement to 4 significant figures — more than enough to confirm the 1/r² law. It's a beautiful dimensional analysis argument: one measurement on Earth, one orbital observation, one scaling law — connect them.",
      },
      {
        title: 'Why the First Attempt Failed',
        text: "Newton in 1666 used 60 English miles per degree of latitude (the conventional value). The true value is ~69 miles/degree. This gave R_Earth ~16% too small, making the predicted g/3600 disagree with the Moon's centripetal acceleration by ~30%. Newton put the calculation aside. After Picard's 1671 measurement gave 69.1 miles/degree, Newton reworked the calculation (reportedly unable to wait for the result — asked a friend to finish the arithmetic) and found near-perfect agreement.",
      },
    ],
  },

  {
    id: 'fluid-resistance',
    slug: 'fluid-resistance',
    titleHe: 'Fluid Resistance & Viscosity',
    titleEn: 'Propositions I–LI, Book II',
    chapterLabel: 'Book II — Sections I–IX (Fluid Mechanics)',
    chapterNumber: 7,
    layer1He:
      "Book II is the Principia's least celebrated section — but it contains Newton's first rigorous foray into fluid mechanics and established the conceptual framework for viscous flow. Proposition 51's analysis of circular fluid motion led Newton to what we now call 'Newton's Law of Viscosity': shear stress τ between fluid layers is proportional to the velocity gradient: τ = μ · (dv/dy), where μ is dynamic viscosity. Fluids obeying this linear relationship are 'Newtonian fluids' — water, air, oils, most simple liquids. Non-Newtonian fluids (blood, polymer melts, cornstarch slurries, drilling muds) violate this linearity. Book II also distinguishes resistance proportional to velocity (viscous/Stokes regime) from resistance proportional to v² (inertial/Newton regime), foreshadowing the Reynolds number.",
    layer3He:
      "Newton's fluid mechanics had significant errors. His corpuscular model of fluid resistance (Proposition 34) treated fluid as discrete particles impacted by a moving body — giving resistance ∝ ρv²A, correct in form but wrong in magnitude (off by a factor ~2 for the drag coefficient). More fundamentally, his inviscid flow model leads to d'Alembert's Paradox (1752): a body moving steadily through an ideal fluid experiences zero drag — obviously wrong. The resolution required Prandtl's boundary layer theory (1904): viscous effects are confined to a thin layer near the body surface, dramatically modifying the pressure distribution. Newton's pendulum experiments to measure viscosity (oscillating in different fluids) were conceptually correct but limited in accuracy. Book II also contains Proposition 50 on the speed of sound — one of Newton's most famous quantitative near-misses.",
    parentGuideHe:
      "For mechanical/systems engineers: the Navier-Stokes equations (Navier 1822, Stokes 1845) are Newton's Law II (F = ma per unit volume) applied to a Newtonian fluid: ρ(Du/Dt) = −∇p + μ∇²u + ρg. The 'Newtonian fluid' assumption underlies all standard CFD codes; non-Newtonian behavior requires additional constitutive models (power-law, Bingham plastic, Carreau model). The Reynolds number Re = ρvL/μ characterizes the transition between viscous-dominated (Re << 1: Stokes flow, linear) and inertia-dominated (Re >> 1: turbulent, nonlinear) regimes — this distinction was implicit in Newton's v vs v² resistance analysis. Modern drag coefficient formulations (F_drag = ½ρv²C_d A) encapsulate Newton's analysis. The Cd dependence on Re (Moody chart for pipe flow, Cd-Re chart for spheres) is the empirical correction to Newton's theoretical estimates.",
    parentPromptsHe: [
      "Newton's drag model (ρv²A) gives the right dimensional form but wrong coefficient. How does Prandtl's boundary layer theory fix this — conceptually, without the detailed math?",
      'd\'Alembert\'s paradox (zero drag in ideal flow) troubled fluid mechanics for 150 years. The resolution involves boundary layers and flow separation. How does the Reynolds number predict where this occurs?',
      "Newton's viscosity law (τ = μ dv/dy) is linear. Blood is non-Newtonian — its viscosity decreases under shear (shear-thinning). What are the engineering implications for medical device design (heart pumps, dialysis)?",
      'The Navier-Stokes equations have been used for 200 years, but a general proof of smooth solutions in 3D is an unsolved Millennium Prize problem. What does this gap between engineering use and mathematical rigor tell us?',
    ],
    isAbstract: false,
    relatedConcepts: ['laws-of-motion', 'speed-of-sound'],
    scientistIds: [],
    color: '#0d9488',
    emoji: '🌊',
    keyFacts: [
      "Newton's Law of Viscosity: τ = μ(dv/dy) — shear stress proportional to velocity gradient",
      'Newtonian fluids: water, air, most oils. Non-Newtonian: blood, polymers, cornstarch suspensions',
      "d'Alembert's Paradox: perfect (inviscid) fluid gives zero drag — resolved by Prandtl's boundary layer (1904)",
      "Newton's corpuscular drag model gives correct dimensional form (F ∝ ρv²A) but wrong coefficient",
      'Re = ρvL/μ — the dimensionless ratio that determines viscous vs inertial regime — implicit in Newton\'s v vs v² analysis',
    ],
    hawkingQuote:
      '"The resistance arising from the want of lubricity in the parts of a fluid, is, other things being equal, proportional to the velocity with which the parts of the fluid are separated from each other." — Proposition 51, Book II',
    historyHe:
      "Aristotle: resistance proportional to velocity (qualitatively). Newton: first quantitative analysis, v and v² regimes, viscosity concept (1687). d'Alembert: paradox of zero drag in ideal flow (1752). Euler: inviscid Euler equations (1757). Navier: viscous flow equations (1822). Stokes: correct derivation of Navier-Stokes (1845). Reynolds: dimensionless transition number (1883). Prandtl: boundary layer theory, resolving d'Alembert's paradox (1904). Kolmogorov: turbulent energy cascade theory (1941).",
    scientistsHe:
      "Isaac Newton — viscosity concept and two-regime resistance analysis. Jean le Rond d'Alembert — zero-drag paradox in ideal flow (1752). Leonhard Euler — inviscid flow equations. Claude-Louis Navier — viscous flow equations (1822). George Stokes — rigorous Navier-Stokes derivation (1845). Osborne Reynolds — dimensionless Re number and turbulent transition (1883). Ludwig Prandtl — boundary layer theory (1904). Andrei Kolmogorov — turbulence energy spectrum (1941).",
    funFactHe:
      "Newton measured viscosity by oscillating pendulums in different fluids and comparing the decay rate. His results were qualitatively correct but quantitatively inaccurate. A modern viscometer (Ubbelohde, cone-and-plate, rheometer) measures the same quantity Newton defined — with automation, temperature control, and shear rate programmatic control. Newton's concept, 340 years of instrumentation evolution.",
    numbersHe: [
      { label: 'Dynamic viscosity of water at 20°C', value: '1.002 × 10⁻³ Pa·s' },
      { label: 'Dynamic viscosity of air at 20°C', value: '1.81 × 10⁻⁵ Pa·s' },
      { label: 'Laminar→turbulent transition (pipe)', value: 'Re ≈ 2300' },
      { label: 'Turbulent drag crisis (sphere)', value: 'Re ≈ 5 × 10⁵' },
    ],
    bookExamplesHe: [
      {
        title: "Newton's Viscosity Experiment",
        text: 'Newton oscillated a pendulum in air, water, and mercury, measuring the time for amplitude to decay to half. The faster the decay, the higher the resistance from the fluid. He correctly identified that denser fluids resist more, and faster motion resists more — laying the conceptual basis for viscosity as a material property. The quantitative results were off due to pressure drag (Newton\'s corpuscular model), but the viscous concept was established.',
      },
      {
        title: "d'Alembert's Paradox — Resolved",
        text: "Perfect fluid (μ = 0): the Euler equations predict symmetric pressure distribution fore and aft of any body → zero net drag. Real fluid (μ > 0): viscosity creates a thin boundary layer; adverse pressure gradient causes flow separation at the rear; asymmetric pressure creates drag. At high Re (turbulent), the boundary layer detaches farther back, actually reducing drag — the 'drag crisis' seen on golf balls and soccer balls. Dimples on a golf ball deliberately trigger turbulence to keep the boundary layer attached longer.",
      },
    ],
  },

  {
    id: 'speed-of-sound',
    slug: 'speed-of-sound',
    titleHe: 'Speed of Sound',
    titleEn: 'Proposition L, Book II',
    chapterLabel: 'Book II — Proposition L (Acoustics)',
    chapterNumber: 8,
    layer1He:
      "Book II, Proposition 50 contains Newton's theoretical derivation of the speed of sound — the first serious attempt to derive a wave speed from first principles. Newton modeled sound as alternating compressions and rarefactions in air, treating the process as isothermal (constant temperature — following Boyle's law: P ∝ 1/V). His result: c = √(P/ρ), where P is atmospheric pressure and ρ is air density. Computing with contemporary values: c ≈ 279 m/s. But the measured speed at the time was ~340 m/s — a 20% error. Newton tried ad-hoc corrections (water vapor, dust particles in air) but couldn't close the gap. Laplace (1816) identified the fundamental error: sound propagation is not isothermal but adiabatic.",
    layer3He:
      "Laplace's correction: compressions and rarefactions in sound waves occur faster than heat can diffuse to neighboring regions — the process is adiabatic, not isothermal. The correct formula: c = √(γP/ρ) = √(γRT/M), where γ = Cp/Cv is the heat capacity ratio. For diatomic gases (N₂, O₂): γ = 7/5 = 1.4. The correction factor √γ = √1.4 ≈ 1.183 brings Newton's 279 m/s to 330 m/s — matching experiment. This is the canonical example of a correct mathematical framework with a wrong physical assumption. Newton had the right dimensional structure (speed ∝ √(elastic modulus/density)) but used the wrong elastic modulus: the isothermal bulk modulus (K_T = P) instead of the adiabatic bulk modulus (K_s = γP). The same structure applies universally: c_rod = √(E/ρ) for longitudinal waves in solids, c_fluid = √(K_s/ρ), c_string = √(T/μ_linear).",
    parentGuideHe:
      "This is the most important engineering lesson in the Principia: correct dimensional structure, wrong physical assumption, measurable error. Newton had the right structure — wave speed = √(elastic modulus / inertia per volume) — but chose the wrong modulus. For engineers: (1) Structural acoustics: c_longitudinal in a thin rod = √(E/ρ). Aluminum: c = √(70×10⁹/2700) = 5090 m/s. (2) Soil mechanics: P-wave speed c = √((K + 4G/3)/ρ). (3) Compressible flow: speed of sound determines Mach number (M = v/c), regime change at M = 1. The γ correction for compressibility appears in isentropic relations: P/ρ^γ = const. Newton's error illustrates why the physical model behind a formula must be validated separately from the mathematical derivation — agreement in dimensional form is necessary but not sufficient.",
    parentPromptsHe: [
      "Newton knew his predicted value (279 m/s) disagreed with measurements (~340 m/s). He offered ad-hoc corrections. Why didn't he revisit the isothermal assumption? What scientific/methodological lesson does this illustrate?",
      'The adiabatic vs isothermal distinction is determined by the ratio of process time to thermal diffusion time. For sound at 1 kHz in air: estimate the characteristic length and check whether the process is adiabatic.',
      'The speed of sound in a solid rod is c = √(E/ρ). Use this to explain ultrasonic non-destructive testing (NDT) — how do you find crack locations?',
      "In a gas turbine, the flow goes supersonic in the nozzle. The local speed of sound depends on local temperature (c = √(γRT/M)). How does this affect the design of variable-geometry nozzles for thrust vectoring?",
    ],
    isAbstract: false,
    relatedConcepts: ['fluid-resistance'],
    scientistIds: [],
    color: '#3b82f6',
    emoji: '🔊',
    keyFacts: [
      "Newton's formula: c = √(P/ρ) — isothermal assumption → 279 m/s (20% error vs measured ~340 m/s)",
      "Laplace's correction (1816): c = √(γP/ρ) — adiabatic assumption → 331 m/s at 0°C (correct)",
      'γ = Cp/Cv = 1.4 for diatomic gases — the factor Newton was missing',
      "This is the canonical example of: correct mathematical structure, wrong physical assumption",
      'General principle: wave speed = √(elastic restoring stiffness / inertia density) — applies to all wave types',
    ],
    hawkingQuote:
      '"The velocities of pulses propagated in an elastic fluid are in a ratio compounded of the square root of the elastic force directly, and the square root of the density inversely." — Proposition 50, Book II',
    historyHe:
      'Mersenne measured speed of sound experimentally: ~316 m/s (1636, using cannon fire timing). Newton derived c = √(P/ρ) theoretically (1687) — predicted 279 m/s. Flamsteed and others measured ~340 m/s. Newton tried corrections in 3rd edition (1726) but couldn\'t close the gap. Laplace corrected to c = √(γP/ρ) (1816) — resolved. Clausius established the thermodynamic basis for γ (1850). Rayleigh unified elastic wave theory (1877). Modern: ultrasonic NDT, medical imaging, seismic exploration all use Newtonian wave speed formula with correct material parameters.',
    scientistsHe:
      "Marin Mersenne — first accurate measurement of sound speed (1636). Isaac Newton — first theoretical derivation, isothermal (wrong). Pierre-Simon Laplace — corrected to adiabatic (1816). Rudolf Clausius — thermodynamic basis for γ (1850). Lord Rayleigh — unified elastic wave theory 'The Theory of Sound' (1877).",
    funFactHe:
      "The speed of sound in seawater varies with temperature, salinity, and pressure — and this variation creates the SOFAR channel (Sound Fixing and Ranging), a natural acoustic waveguide at ~1000m depth where sound can travel thousands of kilometers with minimal loss. The US Navy used it for underwater communication and submarine detection during the Cold War. Newton's c = √(K_s/ρ) is the starting formula for every sonar calculation.",
    numbersHe: [
      { label: 'Newton\'s prediction', value: '279 m/s (isothermal)' },
      { label: 'Laplace correction', value: '331 m/s at 0°C' },
      { label: 'Speed of sound in air at 20°C', value: '343 m/s' },
      { label: 'Speed of sound in steel', value: '~5100 m/s' },
    ],
    bookExamplesHe: [
      {
        title: "What Newton Got Right",
        text: "Newton's dimensional structure is perfect: c has dimensions of m/s, P/ρ has dimensions of m²/s² — so √(P/ρ) has the right units. The scaling is right: higher pressure (stiffer) → faster; denser → slower. The mathematical framework (wave equation derivation from equations of motion for a compressible medium) is correct. The only error: isothermal instead of adiabatic modulus. This structural correctness is why Laplace's correction was a factor, not a complete reformulation.",
      },
      {
        title: 'The Adiabatic/Isothermal Distinction',
        text: "Isothermal: process is slow enough for temperature to equilibrate with surroundings. Adiabatic: process too fast for heat transfer. For sound at 1 kHz in air: half-period = 0.5 ms. Thermal diffusion length: L = √(α·t) = √(2×10⁻⁵ × 5×10⁻⁴) ≈ 0.1 mm. Sound wavelength at 1 kHz: λ = 343mm/1000 = 343 mm. Since L << λ, there's no time for heat to diffuse across a wavelength — the process is adiabatic. This simple scaling argument is all that's needed to identify Newton's error.",
      },
    ],
  },

  {
    id: 'figure-of-earth',
    slug: 'figure-of-earth',
    titleHe: 'Figure of the Earth & Tides',
    titleEn: 'Propositions XVIII–XXXVII, Book III',
    chapterLabel: 'Book III — Props. XVIII–XXXVII (Earth & Tides)',
    chapterNumber: 9,
    layer1He:
      "Book III, Propositions 18–20 tackle the shape of the Earth. Newton argued: a rotating planet bulges at the equator due to the centrifugal effect — it should be an oblate spheroid (flattened at poles). He computed the equatorial radius should exceed the polar by about 1/230 (modern value: 1/298.257). This contradicted the Cassini family's geodetic measurements suggesting Earth is prolate (elongated at poles). Newton was right — confirmed by French geodetic expeditions to Lapland and Peru (1735–1744). Propositions 24–37 develop tidal theory: the tides arise from the differential gravitational pull of the Moon (and Sun) across Earth's diameter — the tidal force, scaling as GM/r³, deforms the ocean into an ellipsoidal shape.",
    layer3He:
      "The tidal force scales as GM/r³ (inversely with the cube of distance, not the square). Despite the Sun's far greater gravity, the Moon's tidal effect is larger (~2.2× the Sun's) because the Moon is so much closer that the differential across Earth is greater. Newton computed the ratio of solar to lunar tidal effects as approximately 1:2.34 (modern: 1:2.17). He correctly predicted spring/neap tide cycles. His static tidal theory predicts one tidal bulge facing the Moon — but Earth's rotation sweeps observers through this bulge, creating two high tides per day. Newton's theory could only predict one — the two-tide-per-day pattern required Laplace's dynamic tidal theory (1775). For Earth's figure: the oblateness causes the Earth's gravitational field to deviate from a perfect 1/r² law, creating a J₂ perturbation. Every Earth-orbiting satellite experiences nodal precession and apsidal drift due to J₂.",
    parentGuideHe:
      "Critical for satellite and space systems engineering: Earth's oblateness (J₂ = 1082.6 × 10⁻⁶) causes secular drift in satellite orbital elements. For a sun-synchronous orbit: the inclination is chosen so that J₂-induced nodal precession (~0.9856°/day westward at 98.7° inclination) exactly matches Earth's orbital rate around the Sun — keeping the orbital plane fixed relative to the Sun, enabling consistent illumination for Earth observation. For GPS: J₂ causes systematic errors in broadcast ephemeris if not modeled. The tidal force concept appears in satellite dynamics as gravity gradient stabilization — a satellite's elongated axis tends to align with local vertical because the lower end experiences greater gravity. This passive attitude stabilization was used on early reconnaissance satellites. The Roche limit (r = a(2M_planet/M_body)^(1/3)) is the tidal disruption distance — inside this, tidal forces exceed internal gravity, tearing the body apart (explanation for Saturn's rings).",
    parentPromptsHe: [
      "Newton predicted Earth's equatorial bulge as 1/230 of the radius; modern value is 1/298.257. What physical effects cause the discrepancy? (Hint: the Earth is not a uniform liquid sphere.)",
      'Sun-synchronous orbits exploit J₂ nodal precession. Compute the required inclination for a 500 km altitude orbit given J₂ = 1.0826 × 10⁻³ and the precession formula: dΩ/dt = −(3/2)(n·J₂·R_E²)/(a²(1−e²)²)·cos(i).',
      'The tidal force scales as 1/r³, not 1/r². Why? Derive the tidal acceleration from first principles for a test mass on the near/far sides of Earth relative to the Moon.',
      'Laplace showed Newton\'s static tidal theory cannot explain two tides per day. The dynamic theory involves resonant modes of ocean basins. What is the analogy in mechanical engineering (vibration modes, resonance)?',
    ],
    isAbstract: false,
    relatedConcepts: ['universal-gravitation', 'moon-test', 'cometary-orbits'],
    scientistIds: [],
    color: '#16a34a',
    emoji: '🌍',
    keyFacts: [
      "Earth's oblateness: equatorial radius exceeds polar by 1/298.257 — Newton predicted 1/230 (same physics, different Earth model)",
      "Tidal force scales as 1/r³ — the Moon's tidal effect exceeds the Sun's despite the Sun's greater gravity",
      "J₂ = 1.0826 × 10⁻³ — Earth's oblateness causes nodal precession in all satellite orbits",
      'Sun-synchronous orbits exploit J₂ precession for consistent illumination geometry',
      'Roche limit: inside 2.46 R_Saturn, tidal forces disrupt satellites — this is why Saturn has rings',
    ],
    hawkingQuote:
      '"The earth is higher under the equator than under the poles, and lower under the poles than under the equator." — Proposition XIX, Book III',
    historyHe:
      "Cassini (1701) measured longer degree of latitude near Paris than near Cayenne — interpreted as prolate Earth. Newton predicted oblate from mechanics (1687). Académie Française: geodetic expedition to Lapland (Maupertuis, 1736) and Peru (La Condamine, 1735–1744) — Lapland degree longer, confirming oblate Earth. Newton vindicated. Laplace: dynamic tidal theory (1775). Adams and Leverrier: predicted Neptune's position from Uranus orbital perturbations (1846) — the ultimate triumph of J₂-style perturbation theory. Modern: GRACE satellite mission (2002–2017) maps time-varying geoid from orbital perturbations.",
    scientistsHe:
      "Giovanni Cassini — measured Earth's shape, incorrectly concluded prolate. Isaac Newton — predicted oblate spheroid from mechanics. Pierre-Louis Maupertuis — Lapland expedition confirming oblate (1736). Pierre-Simon Laplace — dynamic tidal theory (1775). John Adams / Urbain Le Verrier — Neptune prediction from Uranus perturbations (1846). GRACE mission team — mapping time-varying geoid from satellite ranging.",
    funFactHe:
      "The geodetic expedition to prove Newton right vs Cassini was itself a major scientific adventure: the Lapland expedition returned in 1737; the Peru expedition took 10 years (1735–1745). One team member was killed in a bar fight; another was imprisoned; the instruments were damaged by jungle humidity. When both results confirmed Newton's oblate prediction, it was a scientific sensation — and settled a heated 40-year debate.",
    numbersHe: [
      { label: "Earth's equatorial radius", value: '6,378.137 km' },
      { label: "Earth's polar radius", value: '6,356.752 km' },
      { label: 'Oblateness (f = (a−b)/a)', value: '1/298.257' },
      { label: 'J₂ (second zonal harmonic)', value: '1.0826 × 10⁻³' },
    ],
    bookExamplesHe: [
      {
        title: 'Why Tidal Force ∝ 1/r³',
        text: 'Gravitational acceleration at Earth center from Moon: g_c = GM_moon/r². Acceleration at near-Earth surface: g_near = GM_moon/(r−R)². Tidal force = difference = g_near − g_c ≈ 2GM_moon·R/r³ (for R << r). The extra factor of R/r converts 1/r² → 1/r³. This is why the Moon (closer) produces larger tides than the Sun (more massive but much farther): F_tidal ∝ M/r³, and (M_moon/r³_moon) > (M_sun/r³_sun) by a factor of ~2.2.',
      },
      {
        title: "J₂ and Sun-Synchronous Orbits",
        text: "Earth's equatorial bulge pulls satellite orbital planes. For prograde orbits (i < 90°), the orbital plane precesses westward. For retrograde orbits (i > 90°), it precesses eastward. At i ≈ 98.7°, the eastward precession rate = 0.9856°/day = Earth's orbital rate around the Sun. The orbital plane stays fixed relative to the Sun — so the satellite always passes over a given latitude at the same local time. This is the geometry of all weather satellites and most Earth-observation missions.",
      },
    ],
  },

  {
    id: 'cometary-orbits',
    slug: 'cometary-orbits',
    titleHe: 'Cometary Orbits & Halley\'s Prediction',
    titleEn: 'Propositions XL–XLII, Book III',
    chapterLabel: 'Book III — Props. XL–XLII (Comets)',
    chapterNumber: 10,
    layer1He:
      "Book III, Propositions 40–42 and the detailed examples treat cometary orbits — the capstone demonstration of Newton's gravitational theory's universality. Before Newton, comets were considered atmospheric phenomena or supernatural portents following irregular paths. Newton proved comets follow conic-section orbits governed by the same universal gravitation as planets. He developed a geometric method for fitting a parabolic orbit to three observed comet positions, recovering the orbital elements. Applied to the 1680 great comet, he computed its parabolic orbit and confirmed agreement with observations within minutes of arc. Halley then used Newton's method on 24 historical comets, identified three apparitions (1531, 1607, 1682) as the same body on a 75-year orbit, and predicted its return around 1758.",
    layer3He:
      "Halley's orbital analysis (published 1705): comparing historical orbital elements, the 1531 (Apian), 1607 (Kepler), and 1682 (Halley) comets had nearly identical inclinations, perihelia, and semi-major axes — suggesting one body on a ~75-year orbit. Halley predicted return ~1758, correcting for Jupiter and Saturn perturbations. The comet appeared December 25, 1758 — Halley had died in 1742. This was a stunning validation: a quantitative prediction of a unique event 53 years ahead, verified to within weeks. The parabolic approximation works because most comets have e ≈ 0.99 — their elliptical orbits are nearly parabolic. Halley's comet: e = 0.967, period ~75.3 years. Newton also applied the orbit-determination method to the comets of 1664, 1683, and 1684 in the Principia's appendix. The method — three observations → six orbital elements — is a well-posed problem that Newton solved geometrically. Gauss later solved it analytically for Ceres (1801), using least-squares fitting.",
    parentGuideHe:
      "Halley's prediction is arguably the first successful long-range trajectory prediction using a physics-based model. For an engineer: the methodology is orbit determination → propagation → event prediction → verification. This is exactly how JPL operates mission planning and navigation for all deep-space missions. Modern Near-Earth Object (NEO) hazard assessment uses exactly this process: observe an asteroid over multiple apparitions → determine orbital elements → propagate forward using N-body dynamics → compute impact probability. The orbit-determination problem (6 unknowns: 3 position + 3 velocity, or equivalently 6 Keplerian elements) requires a minimum of 3 observations (2D each) — Newton's method. The full least-squares orbit determination (Gauss-Newton, Kalman filter) is the operational tool. Solar system orbital evolution beyond 5 Myr is formally chaotic — the Lyapunov exponent of the inner solar system corresponds to e-folding times of ~5 Myr. Numerical integration codes (JPL HORIZONS, MERCURY) use symplectic integrators to conserve energy over long integrations.",
    parentPromptsHe: [
      'Halley used 24 historical comet records to identify a periodic orbit. This is essentially a clustering problem in 5D orbital element space. How would you approach this with modern data analysis methods?',
      "The Gauss method (1801) solved orbit determination from three observations analytically. How does this compare to the Kalman filter approach used in modern spacecraft navigation — what are the tradeoffs?",
      "Halley's comet's period varies between 75 and 76 years due to Jupiter/Saturn perturbations. How do you propagate uncertainty in the initial orbital elements through these perturbations? What method would you use?",
      'NEO impact probability assessment must integrate orbits over 100+ years under N-body perturbations. The Monte Carlo approach (sampling initial conditions) is standard. What sample size is needed for a 10⁻⁴ impact probability estimate with 10% relative uncertainty?',
    ],
    isAbstract: false,
    relatedConcepts: ['centripetal-force', 'universal-gravitation', 'figure-of-earth'],
    scientistIds: [],
    color: '#7c3aed',
    emoji: '☄️',
    keyFacts: [
      "Halley predicted the comet's return in 1758 — it appeared December 25, 1758 (he died in 1742, never saw it)",
      "Comets follow conic-section orbits — Newton proved this and developed the first orbit-determination method",
      "Halley's comet: e = 0.967, period 75.3 years, perhelion 0.586 AU (inside Venus orbit)",
      'This was the first quantitative long-range trajectory prediction verified by observation',
      "Gauss independently solved orbit determination for Ceres (1801) — the modern Gauss method",
    ],
    hawkingQuote:
      '"Comets are a sort of planets revolving in very eccentric orbits about the sun." — Proposition XL, Book III',
    historyHe:
      "Aristotle: comets are atmospheric exhalations. Tycho Brahe: cometary parallax too small to be atmospheric (1577) — comets are supralunar. Newton: comets follow parabolic orbits, same law of gravity (1687). Halley: identified periodic comet from three historical apparitions (1705), predicted 1758 return. Comet returned December 25, 1758 — named Halley's. Clairaut, Lalande, Lepaute: calculated Jupiter/Saturn perturbations, predicted perihelion ±30 days (1759). Gauss: analytical orbit determination for Ceres (1801). Modern: Halley apparitions 1835, 1910, 1986. Next: 2061.",
    scientistsHe:
      "Tycho Brahe — comets are supralunar (1577). Isaac Newton — conic-section orbits, first geometric orbit determination method. Edmond Halley — periodic comet identification, 1758 prediction. Alexis Clairaut, Joseph-Jérôme Lalande, Nicole-Reine Lepaute — perturbation calculation for 1759 return. Carl Friedrich Gauss — analytical orbit determination from minimal observations (1801).",
    funFactHe:
      "The 1758 return of Halley's Comet was the first astronomical event specifically predicted by name. When the comet appeared on Christmas Day 1758, exactly where Halley predicted 53 years earlier, it was widely reported as proof of Newton's theory. The German astronomer Johann Palitzsch was the first to spot it. French astronomers had bet on the return date — Lalande won.",
    numbersHe: [
      { label: "Halley's comet eccentricity", value: 'e = 0.967' },
      { label: "Halley's comet period", value: '~75.3 years' },
      { label: 'Next perihelion', value: '2061' },
      { label: 'Prediction error for 1758 return', value: '~30 days (< 0.1%)' },
    ],
    bookExamplesHe: [
      {
        title: "Newton's Orbit Determination Method",
        text: 'Three observed sky positions → parabolic orbit fit. The method: (1) Assume parabolic orbit (e = 1). (2) From three positions (right ascension, declination) and times, solve for perihelion distance q and orientation (i, Ω, ω). Newton\'s geometric construction (Lemma VI) does this without algebra — using intersecting lines and a family of parabolas. The problem is equivalent to finding 4 unknowns from 4 equations (3 positions × 2 angles − 2 time parameters). It\'s a well-posed nonlinear system.',
      },
      {
        title: "Why Halley's Prediction Worked",
        text: "Halley compared six orbital elements (a, e, i, Ω, ω, epoch) for 24 historical comets. Three had virtually identical values except epoch — 76 years apart. He concluded: same body. He then propagated the orbit forward to predict the next apparition, correcting for Jupiter and Saturn perturbations (qualitatively estimated). The prediction was within 30 days over a 53-year extrapolation — better than 0.2% relative error on the period. This required: correct force law (1/r²), correct orbital mechanics (conic sections), and correct perturbation estimate. All three came from Newton.",
      },
    ],
  },
];

export const getPrincipiaConceptBySlug = (slug: string) =>
  principiaConcepts.find((c) => c.slug === slug);

export const getPrincipiaRelatedConcepts = (concept: Concept): Concept[] =>
  concept.relatedConcepts
    .map((id) => principiaConcepts.find((c) => c.id === id))
    .filter(Boolean) as Concept[];
