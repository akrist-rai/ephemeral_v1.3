import { db } from '../db';
import { episodes } from '../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors';

export class EpisodeService {
  /**
   * Get all episodes for a given arc, ordered by episode number.
   */
  static async getByArcId(arcId: number) {
    return await db.query.episodes.findMany({
      where: eq(episodes.arcId, arcId),
      orderBy: [episodes.n],
    });
  }

  /**
   * Get a single episode by ID.
   */
  static async getById(id: string) {
    const episode = await db.query.episodes.findFirst({
      where: eq(episodes.id, id),
    });

    if (!episode) throw new NotFoundError('Episode');
    return episode;
  }
}
