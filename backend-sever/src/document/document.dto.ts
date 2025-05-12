import { IsNotEmpty, IsOptional, IsString, IsArray, IsMongoId } from 'class-validator';

export class DocumentDto {
  @IsNotEmpty({ message: 'Title is required' })
  @IsString({ message: 'Title must be a string' })
  title: string;

  @IsNotEmpty({ message: 'User ID is required' })
  @IsString({ message: 'User ID must be a string' })
  @IsMongoId({ message: 'Invalid User ID format' })
  userId: string;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @IsOptional()
  @IsArray({ message: 'Collaborators must be an array' })
  @IsMongoId({ each: true, message: 'Each collaborator must be a valid user ID' })
  collaborators?: string[];
}

export class UpdateDocumentDto {
  @IsOptional()
  @IsString({ message: 'Title must be a string' })
  title?: string;

  @IsOptional()
  @IsString({ message: 'Content must be a string' })
  content?: string;

  @IsOptional()
  @IsArray({ message: 'Collaborators must be an array' })
  @IsMongoId({ each: true, message: 'Each collaborator must be a valid user ID' })
  collaborators?: string[];
}

export class DocumentResponseDto {
  id: string;
  title: string;
  content: string;
  userId: string;
  collaborators: string[];
  createdAt: Date;
  updatedAt: Date;
}