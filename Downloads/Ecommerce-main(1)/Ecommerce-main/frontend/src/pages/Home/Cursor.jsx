

import { useEffect } from "react";

export default function Cursor() {
  useEffect(() => {
    const main = document.querySelector(".cursor-dot");

    const dots = [];
    const totalDots = 4; // 🔥 number of trail dots

    for (let i = 0; i < totalDots; i++) {
      const d = document.createElement("div");
      d.className = "trail-dot";
      document.body.appendChild(d);
      dots.push({ el: d, x: 0, y: 0 });
    }

    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // main dot
      main.style.left = mouseX + "px";
      main.style.top = mouseY + "px";
    });

    function animate() {
      let x = mouseX;
      let y = mouseY;

      dots.forEach((dot, index) => {
        dot.x += (x - dot.x) * 0.2;
        dot.y += (y - dot.y) * 0.2;

        dot.el.style.left = dot.x + "px";
        dot.el.style.top = dot.y + "px";

        x = dot.x;
        y = dot.y;
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return <div className="cursor-dot"></div>;
}