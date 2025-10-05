import { Field, InputType, Int, PartialType } from '@nestjs/graphql';

import { CreateMenuItemInput } from './create-menu-item.input';

@InputType()
export class UpdateMenuItemInput extends PartialType(CreateMenuItemInput) {
	@Field(() => Int)
	id: number;
}
