import { Component } from '@angular/core';
import { Character } from '../../../entities/Character';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import {Skill} from '../../../entities/Skill';
import {SkillIconComponent} from '../../icons/skill-icon/skill-icon.component';

@Component({
    selector: 'app-edit-character-skills',
    imports: [
        SkillIconComponent
    ],
    templateUrl: './edit-character-skills.component.html'
})
export class EditCharacterSkillsComponent {
    character: Character | undefined;
    racialKnownSkillNames: Array<string> = [];
    selectedSkills: Array<string> = [];

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacter().subscribe(
            {
                next: (character) => {
                    this.character = character;

                    // makes it easier to compare racially known skills with available, rather than comparing objects
                    character.skills?.racially_known?.forEach(skill => {
                        this.racialKnownSkillNames.push(skill.name);
                    });
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    isSkillKnown(skillName: string): boolean {
        if (this.racialKnownSkillNames.includes(skillName))
            return true;

        const knownSkills = this.character?.skills?.known.filter(skill => {
            return skill.name === skillName;
        });
        return (knownSkills !== undefined && knownSkills.length > 0);
    }

    toggleSelectSkill(skill: Skill): void {

    }
}
