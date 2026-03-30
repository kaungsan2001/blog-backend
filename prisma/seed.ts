import { prisma } from "../src/db";
import { auth } from "../src/lib/auth";
import { faker } from "@faker-js/faker";

async function main() {
  console.log("seeding");
  const categories = [
    {
      name: "Technology",
      description: "This is technology category",
    },
    {
      name: "Travel",
      description: "This is travel category",
    },
    {
      name: "Food",
      description: "This is food category",
    },
    {
      name: "Fashion",
      description: "This is fashion category",
    },
    {
      name: "Health",
      description: "This is health category",
    },
  ];
  try {
    for (let i = 0; i < 10; i++) {
      const user = await auth.api.signUpEmail({
        body: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "password",
        },
      });

      const category = await prisma.category.create({
        data: {
          name: faker.lorem.word(),
        },
      });

      const blogs = [];
      for (let j = 0; j < 10; j++) {
        blogs.push({
          title: faker.lorem.sentence(),
          categoryId: category.id,
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
