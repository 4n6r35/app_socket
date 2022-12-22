
//Referencias HTML
const lblNuevoTicket = document.querySelector('#lblNuevoTicket')
const btnCrear = document.querySelector('button')

const socket = io();


socket.on('connect', () => {
    //console.log('Conectado');
    btnCrear.disabled = false;
});
socket.on('disconnect', () => {
    //console.log('Se ha desconectado del servidor');
    btnCrear.disabled = true;
});

socket.on('ultimo-ticket', (ultimo) => {
    console.log(ultimo)
    lblNuevoTicket.innerText = 'Tck_ ' + ultimo

});

btnCrear.addEventListener('click', () => {
    socket.emit('siguiente-ticket', null, (ticket) => {
        lblNuevoTicket.innerText = ticket;
    });
})