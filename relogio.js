class WcRelogio extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({ mode: "open" });

        const style = document.createElement("style");
        this.div = document.createElement("div");
        style.textContent = `
            :host {
                display: block;
            }
            div {
                font-family: Arial;
                font-size: 20px;
                text-align: center;
                margin: 10px;
            }
        `;
        this.shadowRoot.append(style, this.div);
    }

    connectedCallback() {
        this.exibirRelogio();

        this.timer = setInterval(() => {
            this.exibirRelogio();
        }, 100);

    }

    disconnectedCallback() {
        clearInterval(this.timer);
    }

    exibirRelogio() {
        const analogico = this.getAttribute("tipo") === "analogico";
        const date = new Date();

        if (analogico) {
            this.exibeRelogioAnalogico(date);
        } else {
            this.exibeRelogioDigital(date);
        }
    }

    exibeRelogioDigital(date) {
        this.div.textContent = formataHora(date);
    }

    exibeRelogioAnalogico(date) {
        const s = date.getSeconds() + date.getMilliseconds() / 1000;
        const m = date.getMinutes() + s / 60;
        const h = (date.getHours() % 12) + m / 60;

        const angulos = [];
        for (let i = 0; i < 12; i++) {
            angulos.push(i * (360 / 12));
        }
        const marcadores = angulos.map(angulo => `
            <g transform="rotate(${angulo})">
                <path d="M 0 -84 v -6" stroke="black" stroke-width="4" />
            </g>
        `);

        this.div.innerHTML = `
            <svg width="200" height="200">
            <g transform="translate(100, 100)">
                <circle cx="0" cy="0" r="90" fill="none" stroke="black" stroke-width="4" />
                    <g transform="rotate(${h * (360 / 12)})">
                        <path d="M 0 0 V -70" stroke="black" stroke-width="3" />
                    </g>

                    <g transform="rotate(${m * 6})">
                        <path d="M 0 0 V -80" stroke="black" stroke-width="4" />
                    </g>

                    <circle cx="0" cy="0" r="6" fill="black" />

                    <g transform="rotate(${s * 6})">
                        <path d="M 0 0 V -80" stroke="red" stroke-width="2"/>
                    </g>

                    <circle cx="0" cy="0" r="4" fill="red" />
                    ${marcadores.join("\n")}

                </g>
            </svg>
        `;
    }
}

function formataHora(date) {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    const s = String(date.getSeconds()).padStart(2, "0");
    return `${h}:${m}:${s}`;
}

customElements.define("wc-relogio", WcRelogio);
