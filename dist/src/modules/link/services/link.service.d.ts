import { Repository } from "typeorm";
import { Link } from "../entities/link.entity";
export declare class LinkService {
    private readonly linkRepository;
    constructor(linkRepository: Repository<Link>);
    create(name: string, url: string, logo?: string, sort?: number): Promise<Link>;
    findAll(): Promise<Link[]>;
    delete(id: string): Promise<void>;
}
