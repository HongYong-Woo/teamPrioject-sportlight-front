const formatDateString = date => {
    const temp = new Date(date);
    const year = temp.getFullYear();
    const month = temp.getMonth().toString().padStart(2,'0');
    const day = temp.getDate().toString().padStart(2,'0');
    const hour = temp.getHours().toString().padStart(2,'0');
    const minutes = temp.getMinutes().toString().padStart(2,'0');
    return `${year}-${month}-${day} ${hour}:${minutes}`;
};

const formatDateStringKr = date => {
    const temp = new Date(date);
    const year = temp.getFullYear();
    const month = temp.getMonth().toString();
    const day = temp.getDate().toString();
    const hour = temp.getHours().toString();
    const minutes = temp.getMinutes().toString();
    return `${year}년 ${month}월 ${day}일 ${hour}시 ${minutes}분`;
};

const formatLocalDateString = date => {
    const temp = new Date(date);
    const year = temp.getFullYear();
    const month = (temp.getMonth() + 1).toString().padStart(2,'0');
    const day = temp.getDate().toString().padStart(2,'0');
    return `${year}-${month}-${day}`;
};

const formatLocalTimeString = date => {
    const temp = new Date(date);
    const hour = temp.getHours().toString().padStart(2,'0');
    const minutes = temp.getMinutes().toString().padStart(2,'0');
    return `${hour}:${minutes}`;
};
export {
    formatDateString,
    formatLocalDateString,
    formatDateStringKr,
    formatLocalTimeString,
}
