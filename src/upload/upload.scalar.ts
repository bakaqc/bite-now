import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ValueNode } from 'graphql';

@Scalar('Upload')
export class UploadScalar implements CustomScalar<any, any> {
	description = 'Upload custom scalar type';

	parseValue(value: any): any {
		return value; // value from the client
	}

	serialize(value: any): any {
		return value; // value sent to the client
	}

	parseLiteral(ast: ValueNode): any {
		if (ast.kind === Kind.STRING) {
			return ast.value;
		}
		return null;
	}
}
