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
    {
      name: "AI",
      description: "This is AI category",
    },
    {
      name: "Javascript",
      description: "This is javascript category",
    },
    {
      name: "Java",
      description: "This is Java Category`",
    },
    {
      name: "Python",
      description: "This is Pyton Category`",
    },
    {
      name: "C++",
      description: "This is C++ Category",
    },
  ];
  try {
    for (let i = 0; i < categories.length; i++) {
      const user = await auth.api.signUpEmail({
        body: {
          name: faker.person.fullName(),
          email: faker.internet.email(),
          password: "password",
        },
      });

      const category = await prisma.category.create({
        data: categories[i]!,
      });

      const blogs = [];
      for (let j = 0; j < 10; j++) {
        blogs.push({
          title: faker.lorem.sentence(),
          categoryId: category.id,
          content: faker.lorem.paragraphs(35),
          authorId: user.user.id,
          isPublished: true,
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
