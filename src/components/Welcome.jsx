import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const FONT_WEIGHTS = {
    subtitle: { min: 100, max: 400, default: 100 },
    title: { min: 400, max: 900, default: 400 },
}

const renderText = (text, className, baseWeight = 400) => {
    return [...text].map((char, i) => (
        <span
            key={i}
            className={className}
            style={{ fontVariationSettings: `'wght' ${baseWeight}` }}
        >
            {char === " " ? "\u00A0" : char}
        </span>
    ));
}

const setupTextHover = (container, type) => {
    if (!container) return () => { };

    const letters = Array.from(container.querySelectorAll("span"));
    const { min, max, default: base } = FONT_WEIGHTS[type];

    // Cache for layout metrics
    let metrics = [];
    let containerRect = { left: 0 };

    const updateMetrics = () => {
        containerRect = container.getBoundingClientRect();
        metrics = letters.map(letter => {
            const rect = letter.getBoundingClientRect();
            return {
                el: letter,
                centerX: rect.left - containerRect.left + rect.width / 2
            };
        });
    };

    // Initial calculation
    updateMetrics();

    // Update on resize
    window.addEventListener('resize', updateMetrics);

    const animateLetter = (letter, weight, duration = 0.25) => {
        gsap.to(letter, {
            duration,
            ease: "power2.out",
            fontVariationSettings: `'wght' ${weight}`,
            overwrite: 'auto'
        });
    }

    const handleMouseMove = (e) => {
        const mouseX = e.clientX - containerRect.left;

        metrics.forEach(({ el, centerX }) => {
            const distance = Math.abs(mouseX - centerX);
            // Adjusted intensity calculation for smoother falloff
            const intensity = Math.exp(-(distance * distance) / 1500);
            const targetWeight = min + (max - min) * intensity;

            animateLetter(el, targetWeight);
        });
    }

    const handleMouseLeave = () => {
        letters.forEach((letter) => animateLetter(letter, base, 0.5));
    }

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
        window.removeEventListener('resize', updateMetrics);
        container.removeEventListener("mousemove", handleMouseMove);
        container.removeEventListener("mouseleave", handleMouseLeave);
    }
}

const Welcome = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useGSAP(() => {
        const titleCleanUp = setupTextHover(titleRef.current, "title");
        const subtitleCleanUp = setupTextHover(subtitleRef.current, "subtitle");

        return () => {
            subtitleCleanUp();
            titleCleanUp();
        }
    }, [])

    return <section id="welcome">
        <p ref={subtitleRef}>
            {renderText(
                "Hey, I'm Manovah! Welcome to my",
                "text-3xl font-georama",
                100
            )}
        </p>
        <h1 ref={titleRef} className="mt-7">{renderText("Portfolio", "text-9xl italic font-georama")}</h1>

        <div className="small-screen">
            <p>This website is design for Desktop/Tablet screens only.</p>
        </div>
    </section>
}
export default Welcome
