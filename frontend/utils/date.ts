export function formatDate(date: string | undefined): string {
    // turn YYYY-MM-DDTHH:MM:SSZ into Dec, 12th
    if (!date) {
        return '';
    }
    
    const dateObj = new Date(date);
    const month = dateObj.toLocaleString('default', { month: 'short' });
    const day = dateObj.getDate();
    const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
    return `${month}, ${day}${suffix}`;
}

export function  calculateProgress (startDate: string, endDate: string): number {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const now = Date.now();
    return ((now - start) / (end - start)) * 100;
};