import { prisma } from "../src/db";
import { auth } from "../src/lib/auth";
import { faker } from "@faker-js/faker";

async function main() {
  console.log("seeding");
  try {
    for (let i = 0; i < 10; i++) {
      const user = await auth.api.signUpEmail({
        body: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "password",
        },
      });

      const blogs = [];
      for (let j = 0; j < 10; j++) {
        blogs.push({
          title: faker.lorem.sentence(),
          category: faker.lorem.word(),
          content: faker.lorem.paragraphs(15),
          authorId: user.user.id,
        });
      }

      await prisma.blog.createMany({
        data: blogs,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

main();
