import { auto } from 'async';
import { failureMessage } from '../messages/index.js';
import { returnResult } from 'asyncjs-util';

const message = '🤖 Unexpected button pushed. This button may no longer be supported?';

/** User pressed an unknown button
  {
    ctx: <Telegram Context Object>
  }
  @returns via cbk or Promise
*/
const warnUnknownButton = ({ ctx }, cbk) => {
  return new Promise((resolve, reject) => {
    return auto(
      {
        // Check arguments
        validate: cbk => {
          if (!ctx) {
            return cbk([400, 'ExpectedTelegramContextToHandleUnknownButton']);
          }

          return cbk();
        },

        // Post a failure message
        failure: [
          'validate',
          async ({}) => {
            return await ctx.reply(message, failureMessage({}).actions);
          },
        ],

        // Stop the loading message
        respond: ['validate', async ({}) => await ctx.answerCallbackQuery()],
      },
      returnResult({ reject, resolve }, cbk)
    );
  });
};

export default warnUnknownButton;
