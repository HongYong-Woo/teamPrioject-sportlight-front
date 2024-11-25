const formatDateString = date => {
    const temp = new Date(date);
    const year = temp.getFullYear();
    const month = temp.getMonth().toString().padStart(2,'0');
    const day = temp.getDate().toString().padStart(2,'0');
    const hour = temp.getHours().toString().padStart(2,'0');
    const minutes = temp.getMinutes().toString().padStart(2,'0');
    return `${year}-${month}-${day} ${hour}:${minutes}`;
};
export {
    formatDateString,
}
