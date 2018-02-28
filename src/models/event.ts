import {location} from './location';

export class event {
    duration: number;
    featured: boolean;
    date: Date;
    id: string;
    imageUrl: string;
    name: string;
    time: string;
    place: location;
    price: number;
    description: string;
    capacity: number = 0;
    attendance: number = 0;
}