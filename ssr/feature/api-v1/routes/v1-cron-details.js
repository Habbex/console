const schema = require('./v1-cron-details.schema');

const v1CronDetails = {
  method: 'GET',
  url: '/api/v1/cron/:groupName/:taskName',
  schema,
  handler: async (request, reply) => {
    const { query, getConfig, getContext } = request;
    const Q1 = getConfig('app.q1.name');
    const fetchq = getContext('fetchq');

    // TODO: validate that this is just a string?
    const { groupName, taskName } = request.params;
    const subject = `${groupName}/${taskName}`;

    const sql = `
      SELECT * FROM "fetchq_catalog"."fetchq__${Q1}__documents"
      WHERE subject = $1
      LIMIT 1
    `;

    const res = await fetchq.pool.query(sql, [subject]);

    if (res.rowCount === 0) {
      reply.send({
        success: false,
        errors: [
          {
            message: `task not found`,
          },
        ],
      });
    } else {
      reply.send({
        success: true,
        data: {
          task: res.rows[0],
        },
      });
    }
  },
};

module.exports = { v1CronDetails };
