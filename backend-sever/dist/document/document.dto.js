"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentResponseDto = exports.UpdateDocumentDto = exports.DocumentDto = void 0;
const class_validator_1 = require("class-validator");
class DocumentDto {
}
exports.DocumentDto = DocumentDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'Title is required' }),
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    __metadata("design:type", String)
], DocumentDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)({ message: 'User ID is required' }),
    (0, class_validator_1.IsString)({ message: 'User ID must be a string' }),
    (0, class_validator_1.IsMongoId)({ message: 'Invalid User ID format' }),
    __metadata("design:type", String)
], DocumentDto.prototype, "userId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Content must be a string' }),
    __metadata("design:type", String)
], DocumentDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Collaborators must be an array' }),
    (0, class_validator_1.IsMongoId)({ each: true, message: 'Each collaborator must be a valid user ID' }),
    __metadata("design:type", Array)
], DocumentDto.prototype, "collaborators", void 0);
class UpdateDocumentDto {
}
exports.UpdateDocumentDto = UpdateDocumentDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Title must be a string' }),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Content must be a string' }),
    __metadata("design:type", String)
], UpdateDocumentDto.prototype, "content", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)({ message: 'Collaborators must be an array' }),
    (0, class_validator_1.IsMongoId)({ each: true, message: 'Each collaborator must be a valid user ID' }),
    __metadata("design:type", Array)
], UpdateDocumentDto.prototype, "collaborators", void 0);
class DocumentResponseDto {
}
exports.DocumentResponseDto = DocumentResponseDto;
//# sourceMappingURL=document.dto.js.map