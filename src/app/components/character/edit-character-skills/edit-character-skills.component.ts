import { Component } from '@angular/core';
import { Character } from '../../../entities/Character';
import { CharacterService } from '../../../services/character.service';
import { Router } from '@angular/router';
import { Skill } from '../../../entities/Skill';
import { SkillIconComponent } from '../../icons/skill-icon/skill-icon.component';

@Component({
    selector: 'app-edit-character-skills',
    imports: [
        SkillIconComponent
    ],
    templateUrl: './edit-character-skills.component.html'
})
export class EditCharacterSkillsComponent {
    character: Character | undefined;
    racialKnownSkillIds: Array<number> = [];
    selectedSkills: Array<number> = [];
    skills: Array<Skill> = [];
    errorMessage: string = '';

    constructor(private characterService: CharacterService, private router: Router) {}

    ngOnInit(): void {
        this.characterService.getCharacter().subscribe(
            {
                next: (character) => {
                    this.character = character;

                    // makes it easier to compare racially known skills with available, rather than comparing objects
                    character.skills?.racial_known?.forEach(skill => {
                        this.racialKnownSkillIds.push(skill.id);
                        this.skills.push(skill);
                    });

                    character.skills?.available?.forEach(skill => {
                        if (!this.racialKnownSkillIds.includes(skill.id)) {
                            this.skills.push(skill);
                        }
                    })

                    // sort the skills, as the list may be out of order if a race had a set skill
                    this.skills.sort((a, b) => a.name.localeCompare(b.name));

                    // add known skills to selectedSkills as this page might be viewed after skills were set
                    character.skills?.known.forEach(skill => {
                        this.selectedSkills.push(skill.id);
                    });
                },
                error: (error => {
                    this.router.navigate(['/']);
                })
            }
        );
    }

    isSkillKnown(skillId: number): boolean {
        if (this.racialKnownSkillIds.includes(skillId))
            return true;

        const knownSkills = this.character?.skills?.known.filter(skill => {
            return skill.id === skillId;
        });

        return (knownSkills !== undefined && knownSkills.length > 0);
    }

    toggleSelectSkill(skill: Skill): void {
        // if the skill is known by racial selection, don't allow it to be unselected
        if (this.racialKnownSkillIds.includes(skill.id))
            return;

        if (this.isSelected(skill.id)) {
            this.selectedSkills.splice(this.selectedSkills.indexOf(skill.id), 1);
        } else {
            if (this.selectedSkills.length < (this.character?.skills?.available_count ?? 0)) {
                this.selectedSkills.push(skill.id);
            }
        }
    }

    isSelected(skillId: number): boolean {
        return this.selectedSkills.includes(skillId);
    }

    setSkillsHandler(): void {
        this.errorMessage = '';

        if (this.selectedSkills.length !== (this.character?.skills?.available_count ?? 0)) {
            this.errorMessage = 'You must select the correct number of skills.';
            return;
        }

        this.characterService.setSkills(this.selectedSkills).subscribe(character => {
            this.router.navigate([`/characters/${character.guid}/edit/spells`]);
        })
    }
}
