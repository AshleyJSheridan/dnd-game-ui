export class CampaignInvite {
    id: number = 0;
    created_at: Date = new Date();
    campaign: {
        guid: string;
        name: string;
    } = {
        guid: '',
        name: '',
    };
    owner: {
        name: string;
    } = {
        name: '',
    }
}
