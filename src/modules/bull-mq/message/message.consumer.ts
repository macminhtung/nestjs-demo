import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueError,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAMES, JOB_NAMES } from 'common/constants/bullmq';

@Processor(QUEUE_NAMES.MESSAGE)
export class MessageConsumer {
  @Process(JOB_NAMES.MESSAGE)
  readOperationJob(job: Job<unknown>) {
    console.log(
      `\n[${QUEUE_NAMES.MESSAGE}] PROCESS - DATA:${JSON.stringify(job.data)}`,
    );
    return 'results';
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`\n[${QUEUE_NAMES.MESSAGE}] ACTIVE`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    console.log(`\n[${QUEUE_NAMES.MESSAGE}] COMPLETED`);
    console.log('\t==> result =', result);
  }

  @OnQueueError()
  onError(error: Error) {
    console.log(`[ERROR - ${QUEUE_NAMES.MESSAGE}] - Message: ${error.message}`);
  }
}
