import { useRef } from "react"
import { Tooltip } from 'react-tooltip'
import { dockApps } from "#constants"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const Dock = () => {
    const dockRef = useRef(null);

    useGSAP(() => {
        const dock = dockRef.current;

        if (!dock) return () => { };

        const items = Array.from(dock.querySelectorAll(".dock-item"));
        const icons = Array.from(dock.querySelectorAll(".dock-icon"));

        // Cache metrics
        let dockRect = { left: 0 };
        let itemMetrics = [];
        const baseWidth = 56; // Default size (w-14 = 3.5rem = 56px)

        const updateMetrics = () => {
            dockRect = dock.getBoundingClientRect();
            itemMetrics = items.map(item => {
                const rect = item.getBoundingClientRect();
                return {
                    el: item,
                    icon: item.querySelector(".dock-icon"),
                    centerX: rect.left - dockRect.left + rect.width / 2
                };
            });
        };

        // Initial calculation
        updateMetrics();
        window.addEventListener('resize', updateMetrics);

        const animateIcons = (mouseX) => {
            const maxDistance = 150; // Influence radius
            const maxScale = 1.5; // Max magnification

            itemMetrics.forEach(({ el, icon, centerX }) => {
                const distance = Math.abs(centerX - mouseX);
                let width = baseWidth;
                let scale = 1;

                if (distance < maxDistance) {
                    const val = distance / maxDistance;
                    // Cosine curve for smooth, bell-shaped falloff
                    const intensity = Math.cos(val * Math.PI / 2);
                    width = baseWidth + (baseWidth * (maxScale - 1)) * intensity;
                    scale = 1 + (maxScale - 1) * intensity;
                }

                // Animate wrapper width (layout)
                gsap.to(el, {
                    width: width,
                    duration: 0.1,
                    ease: "power2.out",
                    overwrite: "auto"
                });

                // Animate icon scale (visual)
                gsap.to(icon, {
                    scale: scale,
                    transformOrigin: "bottom center",
                    duration: 0.1,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            })
        }

        const handleMouseMove = (e) => {
            const mouseX = e.clientX - dockRect.left;
            animateIcons(mouseX);
        }

        const resetIcons = () => {
            items.forEach((item) => gsap.to(item, {
                width: baseWidth,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            }));
            icons.forEach((icon) => gsap.to(icon, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
            }));
        }

        const handleMouseLeave = () => resetIcons();

        dock.addEventListener("mousemove", handleMouseMove);
        dock.addEventListener("mouseleave", handleMouseLeave);

        return () => {
            window.removeEventListener('resize', updateMetrics);
            dock.removeEventListener("mousemove", handleMouseMove);
            dock.removeEventListener("mouseleave", handleMouseLeave);
        }

    }, []);

    const toggleApp = (app) => {
        // TODO: Open app logic
    }
    return <section id="dock">
        <div ref={dockRef} className="dock-container">
            {dockApps.map(({ id, name, icon, canOpen }) => (
                <div key={id} className="dock-item relative flex justify-center w-14">
                    <button
                        type="button"
                        className="dock-icon"
                        aria-label={name}
                        data-tooltip-id="dock-tooltip"
                        data-tooltip-content={name}
                        data-tooltip-delay-show={150}
                        disabled={!canOpen}
                        onClick={() => toggleApp({ id, canOpen })}
                    >
                        <img src={`/images/${icon}`} alt={name} loading="lazy" className={canOpen ? "" : "opacity-60"} />
                    </button>
                </div>
            ))}

            <Tooltip id="dock-tooltip" className="tooltip" />
        </div>
    </section>
}

export default Dock