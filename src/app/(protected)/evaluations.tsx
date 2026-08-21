import { Redirect } from 'expo-router';


const USERNAME = "xLeay";
export default function Evaluations() {

    return (
        <Redirect href={`/user/${USERNAME}/reviews`} />
    );
}

