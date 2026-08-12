import FollowListScreen from '#/user/FollowListScreen';
import { MOCK_FOLLOWS } from '@/src/mock/following.mock';

export default function Following() {
    return (
        <FollowListScreen
            title="Abonnements"
            data={MOCK_FOLLOWS}
        />
    );
}