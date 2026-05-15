import { Role } from "@domain/common/enum/role";
import { User, App, Link, Tag, Rating, LinkType } from "@domain/entities";

import AppDataSource from "@config/data-source.config";

const seed = async () => {
    await AppDataSource.initialize();
    console.log("Database connected!");

    const userRepo = AppDataSource.getRepository(User);
    const appRepo = AppDataSource.getRepository(App);
    const linkRepo = AppDataSource.getRepository(Link);
    const tagRepo = AppDataSource.getRepository(Tag);
    const ratingRepo = AppDataSource.getRepository(Rating);
    const linkTypeRepo = AppDataSource.getRepository(LinkType);

    // Create Users
    const users = await userRepo.save([
        { name: "admin", email: "admin@example.com", bio: "Super admin", role: Role.ADMIN },
        { name: "Alice", email: "alice@example.com", bio: "Software Engineer", role: Role.DEVELOPER },
        { name: "Bob", email: "bob@example.com", bio: "Tech Enthusiast", role: Role.DEVELOPER },
        { name: "Charlie", email: "charlie@example.com", bio: "App Developer", role: Role.DEVELOPER },
        { name: "David", email: "david@example.com", bio: "Gamer & Streamer", role: Role.DEVELOPER },
        { name: "Eve", email: "eve@example.com", bio: "Entrepreneur", role: Role.DEVELOPER },
    ]);

    // Create Link Types
    const linkTypes = await linkTypeRepo.save([
        { name: "Website", icon: "🌍" },
        { name: "GitHub", icon: "🐙" },
        { name: "Twitter", icon: "🐦" },
        { name: "LinkedIn", icon: "🔗" },
    ]);

    // Create Links
    const links = await linkRepo.save([
        { url: "https://github.com/alice", linkTypeId: linkTypes[1].id, ownerId: users[0].id },
        { url: "https://twitter.com/alice", linkTypeId: linkTypes[2].id, ownerId: users[0].id },
    ]);

    // Create Tags
    const tags = await tagRepo.save([
        { name: "Tech", slug: "tech" },
        { name: "AI", slug: "ai" },
        { name: "Gaming", slug: "gaming" },
        { name: "Education", slug: "education" },
        { name: "Finance", slug: "finance" },
    ]);

    const getRandomItems = <T>(arr: T[], maxCount: number) => {
        const count = Math.floor(Math.random() * (maxCount + 1));
        return arr.sort(() => 0.5 - Math.random()).slice(0, count);
    };

    const apps: Partial<App>[] = Array.from({ length: 5 }).map((_, index) => ({
        name: `App ${index + 1}`,
        isAutoPublished: Math.random() < 0.5,
        ownerId: users[Math.floor(Math.random() * users.length)].id,
        tags: getRandomItems(tags, tags.length),
        socialLinks: getRandomItems(links, links.length),
    }));

    await appRepo.save(apps);

    const getRandomInt = (min: number, max: number) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    const ratings: Partial<Rating>[] = apps.flatMap((app) => {
        const possibleUsers = users.filter((user) => user.id !== app.ownerId); // Exclude app owner

        return Array.from({ length: 20 }).map(() => ({
            appId: app.id,
            userId: possibleUsers[getRandomInt(0, possibleUsers.length - 1)].id, // Random user
            score: getRandomInt(1, 5),
            comment: Math.random() < 0.5 ? `Review for ${app.appTranslations.map(t => t.name).join(", ")}` : undefined, // 50% chance of comment
        }));
    });

    await ratingRepo.save(ratings);

    console.log("Seed data inserted!");
    process.exit();
};

seed().catch((err) => {
    console.error("Error seeding data:", err);
    process.exit(1);
});
