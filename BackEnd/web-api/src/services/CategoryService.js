class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    async findAll() {
        return await this.categoryRepository.findAll();
    }

    async findByName(name) {
        return await this.categoryRepository.findByName(name);
    }
}

module.exports = CategoryService