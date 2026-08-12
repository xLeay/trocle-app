import FollowListScreen from '#/user/FollowListScreen';
import { MOCK_FOLLOWERS } from '@/src/mock/followers.mock';

export default function Followers() {
    return (
        <FollowListScreen
            title="Abonnés"
            data={MOCK_FOLLOWERS}
            showFollowBackLabel
        />
    );
}