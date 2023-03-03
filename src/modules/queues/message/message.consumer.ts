import {
  Process,
  Processor,
  OnQueueActive,
  OnQueueError,
  OnQueueCompleted,
} from '@nestjs/bull';
import { Job } from 'bull';
import { QUEUE_NAMES, JOB_NAMES } from 'common/constant/bullmq';

@Processor(QUEUE_NAMES.MESSAGE)
export class MessageConsumer {
  @Process(JOB_NAMES.MESSAGE)
  readOperationJob(job: Job<unknown>) {
    console.log(job.data);
    return job.data;
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(`[ACTIVE - ${QUEUE_NAMES.MESSAGE}] - Processing job ${job.id}`);
    console.log('\n ==> data =', job.data);
  }

  @OnQueueError()
  onError(error: Error) {
    console.log(`[ERROR - ${QUEUE_NAMES.MESSAGE}] - Message: ${error.message}`);
  }

  @OnQueueCompleted()
  onCompleted(job: Job, result: any) {
    console.log(
      `[COMPLETED - ${QUEUE_NAMES.MESSAGE}] -  JobId(${job.id}) successfully completed`,
    );
    console.log('\n ==> result =', result);
  }
}
