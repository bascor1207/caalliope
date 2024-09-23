import { describe, it } from 'vitest';

describe('add-review.usecase', () => {
  it('should be correctly implemented', async () => {
   givenAConnectedUser();

   await whenICallTheAddReviewUsecase();

   thenICanGetTheReview();
  });
});

function givenAConnectedUser() {
  // given...
}

async function whenICallTheAddReviewUsecase() {
  // when...
}

function thenICanGetTheReview() {
  // then...
}
