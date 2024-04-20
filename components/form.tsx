'use client'
// inport form json convet into the server api using router ->  add kar na 
import axios from 'axios';

import { useState } from 'react'
import { motion } from 'framer-motion'

import {faker} from "@faker-js/faker";

import { set, z } from 'zod'
import { FormDataSchema } from '@/lib/schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from './ui/button';


type Inputs = z.infer<typeof FormDataSchema>

function generateUniqueID(): string {
  const randomPart = Math.random().toString(36).substr(2, 9);
  const timestampPart = Date.now().toString(36);

  return `${randomPart}${timestampPart}`;
}

const steps = [
  {
    id: 'Step 1',
    name: 'Project Title',
    fields: ['Project Name', 'lastName', 'email']
  },
  {
    id: 'Step 2',
    name: 'Features & Settings',
    fields: ['country', 'state', 'city', 'street', 'zip']
  },
  { id: 'Step 3', name: 'Submission' }
]

export default function Form() {
  const [previousStep, setPreviousStep] = useState(0)
  const [currentStep, setCurrentStep] = useState(0)
  const delta = currentStep - previousStep

  const {
    register,
    handleSubmit,
    watch,
    reset,
    trigger,
    formState: { errors }
  } = useForm<Inputs>({
    resolver: zodResolver(FormDataSchema)
  })

  const processForm: SubmitHandler<Inputs> = data => {
    console.log(data)
    reset()
  }

  type FieldName = keyof Inputs

  const [isLoading, setIsLoading] = useState(false)
  const [vId, setVideoUrl] = useState('');
  const [name, setProjectName] = useState('');
  const [pId,setPId]=useState('');
  const [reels,setReels]=useState(false);

  const next = async () => {
    const fields = steps[currentStep].fields
    const output = await trigger(fields as FieldName[], { shouldFocus: true })
    if (!output) return
    if (currentStep < steps.length - 1) {
      if (currentStep === steps.length - 2) {
        
        setIsLoading(true)
        
        const formDataFromWatch = watch();
        // console.log(formDataFromWatch)
        const formData = new FormData();

        Object.entries(formDataFromWatch).forEach(([key, value]) => {
          if (key === 'pdfFile') {
            const pdfFiles = value as FileList;
            if (pdfFiles instanceof FileList && pdfFiles.length > 0) {
              const pdfFile = pdfFiles[0];
              formData.append('pdfFile', pdfFile);
              console.log(`${key} appended`);
              console.log(pdfFile);
            } else {
              console.log('pdfFile is not a File or empty:', pdfFiles);
            }
          } else {
            formData.append(key, value as string);
            console.log(`${key} appended`);
          }
        });
        
      
        sendDataToFlaskAPI(formData);
        setTimeout(() => {
            setIsLoading(false);
          }, 340000);
      }
      setPreviousStep(currentStep)
      setCurrentStep(step => step + 1)
    }
  }

  const sendDataToFlaskAPI = async (data: FormData) => {
    try {
      const response = await axios.post('http://20.197.15.85/api/mockapi', data);
      if (response.status === 200) {
        console.log(response.data);

        const { video_url } = response.data;
        console.log(response.data);
        const { projectName } = response.data;
        const {reels}=response.data;
        console.log(projectName)
        console.log('Data sent successfully:', response.data);
        setVideoUrl(video_url);
        setProjectName(projectName);
        setReels(reels);
      } else {
        console.error('Failed to send data');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  const prev = () => {
    if (currentStep > 0) {
      setPreviousStep(currentStep)
      setCurrentStep(step => step - 1)
    }
  }

  const handleDiscardChanges = () => {
    window.location.reload(); 
  };

  const submitVideo=async()=>{
    const name=faker.company.name();
    const userId=faker.internet.userName();
    const values = {
        name,
        userId,
        vId,
        pId:generateUniqueID(),
        reels
      };

    try{
        const response = await axios.post('/api/projects',values);
        console.log(response);
        
    }catch(error){
        console.log("TRY AGAIN");
        console.log(error);
    }finally{}
  }

  return (
    <section className='inset-0 flex flex-col justify-between p-24'>
      {/* steps */}
      <nav aria-label='Progress'>
        <ol role='list' className='space-y-4 md:flex md:space-x-8 md:space-y-0'>
          {steps.map((step, index) => (
            <li key={step.name} className='md:flex-1'>
              {currentStep > index ? (
                <div className='group flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-sky-600 transition-colors '>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              ) : currentStep === index ? (
                <div
                  className='flex w-full flex-col border-l-4 border-sky-600 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'
                  aria-current='step'
                >
                  <span className='text-sm font-medium text-sky-600'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              ) : (
                <div className='group flex w-full flex-col border-l-4 border-gray-200 py-2 pl-4 transition-colors md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4'>
                  <span className='text-sm font-medium text-gray-500 transition-colors'>
                    {step.id}
                  </span>
                  <span className='text-sm font-medium'>{step.name}</span>
                </div>
              )}
            </li>
          ))}
        </ol>
      </nav>

      {/* Form */}
      <form className='mt-8 py-8' onSubmit={handleSubmit(processForm)}>
      {currentStep === 0 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Project Information
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Provide project details.
            </p>
            
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-6'>
                <label
                  htmlFor='projectName'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Project Name
                </label>
                <div className='mt-2'>
                  <input
                    type='text'
                    id='projectName'
                    {...register('projectName')}
                    autoComplete='off'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            
              <div className='sm:col-span-6'>
                <label
                  htmlFor='pdfFile'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Upload document
                </label>
                <div className='mt-2'>
                  <input
                    type='file'
                    id='pdfFile'
                    {...register('pdfFile')}
                    accept='.pdf'
                    className='block w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:text-sm sm:leading-6'
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 1 && (
          <motion.div
            initial={{ x: delta >= 0 ? '50%' : '-50%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <h2 className='text-base font-semibold leading-7 text-gray-900'>
              Language Selection
            </h2>
            <p className='mt-1 text-sm leading-6 text-gray-600'>
              Select preferred language and settings.
            </p>
        
            <div className='mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6'>
              <div className='sm:col-span-3'>
                <label
                  htmlFor='language'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Language
                </label>
                <div className='mt-2'>
                  <select
                    id='language'
                    {...register('language')}
                    autoComplete='language'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6'
                  >
                    <option value='hi'>Hindi</option>
                    <option value='en'>English</option>
                    <option value='bn'>Bengali</option>
                    <option value='ta'>Indian Tamil</option>
                    <option value='te'>Telugu</option>
                    <option value='mr'>Marathi</option>
                    <option value='kn'>Kannada</option>
                    <option value='gu'>Gujarati</option>
                    <option value='ml'>Malayalam</option>
                    <option value='ur'>Indian Urdu</option>
                    
                    
                  </select>
                  {errors.language?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.language.message}
                    </p>
                  )}
                </div>
              </div>
                
              <div className='sm:col-span-3'>
                <label className='block text-sm font-medium leading-6 text-gray-900'>
                  Anchor Voice
                </label>
                <div className='mt-2 flex items-center space-x-4'>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      value='male'
                      {...register('anchorVoice')}
                      className='form-radio text-sky-600 focus:ring-sky-600'
                    />
                    <span className='ml-2 text-gray-900'>Male</span>
                  </label>
                  <label className='flex items-center'>
                    <input
                      type='radio'
                      value='female'
                      {...register('anchorVoice')}
                      className='form-radio text-sky-600 focus:ring-sky-600'
                    />
                    <span className='ml-2 text-gray-900'>Female</span>
                  </label>
                </div>
                {errors.anchorVoice?.message && (
                  <p className='mt-2 text-sm text-red-400'>
                    {errors.anchorVoice.message}
                  </p>
                )}
              </div>
                
              <div className='sm:col-span-3'>
                <label
                  htmlFor='postMode'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Post Mode
                </label>
                <div className='mt-2'>
                  <select
                    id='postMode'
                    {...register('postMode')}
                    autoComplete='post-mode'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6'
                  >
                    <option value='manual'>Manual</option>
                    <option value='automatic'>Automatic</option>
                  </select>
                  {errors.postMode?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.postMode.message}
                    </p>
                  )}
                </div>
              </div>

              <div className='sm:col-span-3'>
        <label
          htmlFor='videoFormat'
          className='block text-sm font-medium leading-6 text-gray-900'
        >
          Video Format
        </label>
        <div className='mt-2'>
          <select
            id='videoFormat'
            {...register('videoFormat')}
            autoComplete='video-format'
            className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6'
          >
            <option value='MP4'>MP4</option>
            <option value='MOV'>MOV</option>
            <option value='WMV'>WMV</option>
            <option value='AVI'>AVI</option>
          </select>
          {errors.videoFormat?.message && (
            <p className='mt-2 text-sm text-red-400'>
              {"Please select a video format"}
            </p>
          )}
        </div>
      </div>

              <div className='sm:col-span-3'>
                <label
                  htmlFor='reels'
                  className='block text-sm font-medium leading-6 text-gray-900'
                >
                  Export as reel
                </label>
                <div className='mt-2'>
                  <select
                    id='reels'
                    {...register('reels')}
                    autoComplete='reels'
                    className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-sky-600 sm:max-w-xs sm:text-sm sm:leading-6'
                  >
                    <option value='true'>Yes</option>
                    <option value='false'>No</option>
                  </select>
                  {errors.reels?.message && (
                    <p className='mt-2 text-sm text-red-400'>
                      {errors.reels.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentStep === 2 && (
          <>
          <div className="flex flex-row">
            <div>
                <h2 className='text-base font-semibold leading-7 text-gray-900'>
                    Completion
                </h2>
                <p className='mt-1 text-sm leading-6 text-gray-600'>
                    Thank you for your submission, wait until the process is complete.
                </p>
                {!isLoading && vId && (
                    <div className="flex flex-row gap-4 pt-4">
                        <div>
                            <Button variant="destructive" onClick={submitVideo}>Submit for apporval</Button>
                        </div>
                        <div>
                            <Button variant="default"  onClick={handleDiscardChanges} >Discard Changes</Button>
                        </div>
                    </div>
                )}
            </div>
            
            {isLoading && (
              <div className='flex justify-center items-center h-32 mt-12'>
                <div className='animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-900'></div>
              </div>
            )}

            {!isLoading && vId && (
                <div className="pl-24">
                    <video width='320' height='240' controls>
                        <source src={vId} type='video/mp4' />
                        Your browser does not support the video tag.
                    </video>
                </div>
                
            )}



          </div>
            
          </>
        )}
      </form>

      {/* Navigation */}
      <div className='mt-8 pt-5'>
        <div className='flex justify-between'>
          <button
            type='button'
            onClick={prev}
            disabled={currentStep === 0}
            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M15.75 19.5L8.25 12l7.5-7.5'
              />
            </svg>
          </button>
          <button
            type='button'
            onClick={next}
            disabled={currentStep === steps.length - 1}
            className='rounded bg-white px-2 py-1 text-sm font-semibold text-sky-900 shadow-sm ring-1 ring-inset ring-sky-300 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <svg
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 24 24'
              strokeWidth='1.5'
              stroke='currentColor'
              className='h-6 w-6'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                d='M8.25 4.5l7.5 7.5-7.5 7.5'
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
}