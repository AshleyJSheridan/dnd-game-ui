import { Skill } from './Skill';
import { Spell } from './Spell';
import { Language } from './Language';
import { Item } from './Item';
import { CreatureAlignment } from './CreatureAlignment';
import { Money } from './Money';
import {CharacterClassFeature} from './CharacterClassFeature';

export class Character {
    name: string = '';
    guid: string = '';
    level: number = 1;
    speed: number = 25;
    hit_points: {
        max: number;
        current: number;
    } = {
        max: 0,
        current: 0,
    }
    proficiency_bonus: number = 2;
    charClass: string = '';
    class_path_available: boolean = false;
    class_path_name: string = '';
    selected_class_path: {
        id: number;
        name: string;
        features: Array<CharacterClassFeature>;
    } = {
        id: 0,
        name: '',
        features: [],
    };
    class_features: Array<CharacterClassFeature> = [];
    saving_throws: Array<{
        name: string;
        short_name: string;
    }> = [];
    charBackground: {
        name: string;
        characteristics: Array<{
            id: number;
            characteristic_type: string;
            details: string;
        }>
    } = {
        name: '',
        characteristics: []
    };
    charRace: string = '';
    abilities: Array<{
        id: number;
        name: string;
        short_name: string;
        description: number;
        base: number;
        modifier: number;
        racialModifier: number;
    }> = [];
    skills: {
        known: Array<Skill>;
        racial_known: Array<Skill>;
        available: Array<Skill>;
        available_count: number;
    } = {
        known: [],
        racial_known: [],
        available: [],
        available_count: 0,
    };
    languages : {
        available: number;
        known: Array<Language>,
        racial: Array<Language>,
        class: Array<Language>,
    } = {
        available: 0,
        known: [],
        racial: [],
        class: [],
    };
    magic: {
        hasMagic: boolean;
        learned_spells: Array<Spell>;
        other_known_spells: Array<Spell>;
    } = {
        hasMagic: false,
        learned_spells: [],
        other_known_spells: [],
    };
    custom_portrait: string = '';
    inventory: {
        money: Money,
        items: Array<Item>,
    } = {
        money: {},
        items: []
    };
    alignment: CreatureAlignment | undefined;
    created_at: Date = new Date();
}
