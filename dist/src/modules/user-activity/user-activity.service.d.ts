import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';
import { BrowseHistory } from './entities/browse-history.entity';
import { User } from '../user/entities/user.entity';
export declare class UserActivityService {
    private favoriteRepository;
    private browseHistoryRepository;
    constructor(favoriteRepository: Repository<Favorite>, browseHistoryRepository: Repository<BrowseHistory>);
    addFavorite(user: User, productId: number): Promise<Favorite>;
    removeFavorite(user: User, productId: number): Promise<void>;
    getUserFavorites(userId: number, page?: number, limit?: number): Promise<{
        favorites: Favorite[];
        total: number;
    }>;
    recordProductView(user: User, productId: number): Promise<void>;
    getBrowseHistory(userId: number, page?: number, limit?: number): Promise<{
        history: BrowseHistory[];
        total: number;
    }>;
    clearBrowseHistory(userId: number): Promise<void>;
}
