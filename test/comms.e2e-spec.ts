import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('GET /comms/your-next-delivery/:userId (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns 200 with the README example body for a known user', () => {
    return request(app.getHttpServer())
      .get('/comms/your-next-delivery/ff535484-6880-4653-b06e-89983ecf4ed5')
      .expect(200)
      .expect({
        title: 'Your next delivery for Dorian and Ocie',
        message:
          "Hey Kayleigh! In two days' time, we'll be charging you for your next order for Dorian and Ocie's fresh food.",
        totalPrice: 134,
        freeGift: true,
      });
  });

  it('returns 400 when the user ID is not a UUID', () => {
    return request(app.getHttpServer())
      .get('/comms/your-next-delivery/not-a-uuid')
      .expect(400);
  });

  it('returns 404 when no user has the ID', () => {
    return request(app.getHttpServer())
      .get('/comms/your-next-delivery/00000000-0000-4000-8000-000000000000')
      .expect(404);
  });
});
