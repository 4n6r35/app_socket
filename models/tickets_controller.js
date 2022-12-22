import path from 'path'
import fs from 'fs'


class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}
class TicketControl {
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = []
        this.ultimos = []

        this.init();
    }

    get toJson() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            tickets: this.tikets,
            ultimos: this.ultimos
        }
    }

    async init() {
        const { hoy, tikets, ultimo, ultimos } = (await import('../db/data.json', { assert: { type: "json" } })).default;
        if (hoy === this.hoy) {
            this.tikets = tikets;
            this.ultimo = ultimo;
            this.ultimos = ultimos;
        } else {
            this.GuardarDB();
        }
    }

    GuardarDB() {
        const dbPath = path.join(process.cwd(), './db/data.json');
        fs.writeFileSync(dbPath, JSON.stringify(this.toJson));
    }

    Siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);

        this.GuardarDB();
        return 'Ticket' + ticket.numero;

    }

    AtenderTickets(escritorio) {
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); //tickets[0];
        ticket.escritorio = escritorio;
        this.ultimos.unshift(ticket);
        if (this.ultimos.length > 4) {
            this.ultimos.splice(-1, 1)
        }

        console.log(this.ultimos)
        this.GuardarDB();
        return ticket
    }
}

export { TicketControl }