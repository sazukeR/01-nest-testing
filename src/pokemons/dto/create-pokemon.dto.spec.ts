import { validate } from 'class-validator';
import { CreatePokemonDto } from './create-pokemon.dto';

describe('CreatePokemonDto', () => {
  it('should be valid with the required correct data', async () => {
    const dto = new CreatePokemonDto();

    ((dto.name = 'Pikachu'), (dto.type = 'Electric'));

    const errors = await validate(dto);

    expect(errors.length).toBe(0);
  });

  it('should be invvalid without name property', async () => {
    const dto = new CreatePokemonDto();

    dto.type = 'Electric';

    const errors = await validate(dto);

    const nameError = errors.find((error) => error.property === 'name');

    expect(nameError).toBeDefined();
  });

  it('should be invvalid without type property', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';

    const errors = await validate(dto);

    const typeError = errors.find((error) => error.property === 'type');

    expect(typeError).toBeDefined();
  });

  it('property hp must be valid with a positive number', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.hp = -10;

    const errors = await validate(dto);

    // console.log(errors);

    const hpError = errors.find((error) => error.property === 'hp');

    expect(hpError).toBeDefined();

    expect(hpError?.constraints).toEqual({ min: 'hp must not be less than 0' });
  });

  it('property sprites must be invalid with non-string sprites', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.sprites = [123, 450] as unknown as string[];

    const errors = await validate(dto);

    const spritesError = errors.find((error) => error.property === 'sprites');

    expect(spritesError).toBeDefined();

    expect(spritesError?.constraints).toEqual({
      isString: 'each value in sprites must be a string',
    });
  });

  it('property sprites must be valid with string sprites', async () => {
    const dto = new CreatePokemonDto();

    dto.name = 'Pikachu';
    dto.type = 'Electric';
    dto.sprites = ['sprite1.jpg', 'sprite2.jpg'] as unknown as string[];

    const errors = await validate(dto);

    const spritesError = errors.find((error) => error.property === 'sprites');

    expect(spritesError).toBe(undefined);
    expect(spritesError).toBeUndefined();
  });
});
