import { db } from '../db';
import { arcs } from '../db/schema';
import { eq } from 'drizzle-orm';
import { NotFoundError } from '../lib/errors';

export class ArcService {
  /**
   * Get all arcs.
   */
  static async getAll() {
    return await db.query.arcs.findMany({
      orderBy: [arcs.id],
    });
  }

  /**
   * Get a single arc by ID.
   */
  static async getById(id: number) {
    const arc = await db.query.arcs.findFirst({
      where: eq(arcs.id, id),
    });

    if (!arc) throw new NotFoundError('Arc');
    return arc;
  }
}
