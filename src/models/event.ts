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
    description: string;
    capacity: number;
    attendance: number;
}