import { TicketControl } from "../models/tickets_controller.js";


const ticketControl = new TicketControl();

const socketController = (socket) => {

    //CUANDO UN CLIENTE SE CONECTA
    socket.emit('estado-actual', ticketControl.ultimos);
    socket.emit('ultimo-ticket', ticketControl.ultimo);
    //tickets pendiente
    socket.emit('tickets-pendiente', ticketControl.tickets.length)


    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.Siguiente();
        callback(siguiente)
        //TO DO: Nuevo ticket pendiente de asignar 
        socket.broadcast.emit('tickets-pendiente', ticketControl.tickets.length)
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({
                ok: false,
                msg: 'Escritorio obligatorio'
            });
        }
        const ticket = ticketControl.AtenderTickets(escritorio)
        // TODO Notificar cambios en los ultimos tickets
        socket.broadcast.emit('estado-actual', ticketControl.ultimos);
        socket.emit('tickets-pendiente', ticketControl.tickets.length);
        socket.broadcast.emit('tickets-pendiente', ticketControl.tickets.length);
        if (!ticket) {
            callback({
                ok: false,
                msg: 'No hay tickets pendientes'
            });
        } else {
            callback({
                ok: true,
                ticket
            })
        }
    });

}



export {
    socketController
}

