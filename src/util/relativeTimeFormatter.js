const formatRelativeTime = (inputDate) => {
    const now = new Date();
    const targetDate = new Date(inputDate);
    const diffInSeconds = Math.floor((now - targetDate) / 1000);

    const rtf = new Intl.RelativeTimeFormat('ko', { numeric: 'auto' });

    if (diffInSeconds < 60) {
        return '방금 전';
    } else if (diffInSeconds < 3600) {
        const minutesAgo = Math.floor(diffInSeconds / 60);
        return rtf.format(-minutesAgo, 'minute');
    } else if (diffInSeconds < 86400) {
        const hoursAgo = Math.floor(diffInSeconds / 3600);
        return rtf.format(-hoursAgo, 'hour');
    } else if (diffInSeconds < 7 * 86400) {
        const daysAgo = Math.floor(diffInSeconds / 86400);
        return rtf.format(-daysAgo, 'day');
    } else {
        return targetDate.toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
        });
    }
};

export default formatRelativeTime;