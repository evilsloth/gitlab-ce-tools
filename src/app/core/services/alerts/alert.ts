export interface Alert {
    type: 'success' | 'info' | 'warning' | 'danger';
    text: string;
    count?: number;
}
