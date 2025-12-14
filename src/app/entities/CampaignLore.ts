export class CampaignLore {
    guid: string = '';
    name: string = '';
    type: CampaignLoreType = CampaignLoreType.TEXT;
    created_at: Date = new Date();
    content: string = '';
    content_raw: string = '';
    url: string = '';
    is_file: boolean = false;
    is_image: boolean = false;
    lore_group: string = '';
}

export enum CampaignLoreType {
    TEXT = 'text',
    LINK = 'link',
    FILE = 'file'
}
