"use client";

import { addEmailToProduct } from "@/lib/actions";
import {
  Button,
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import Image from "next/image";
import { FormEvent, useState } from "react";

interface Props{
  productId: string
}

const Modal = ({ productId }: Props) => {
  let [isOpen, setIsOpen] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false)
  const [email, setEmail] = useState('')
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmit(true);
    await addEmailToProduct(productId, email)
    setEmail('');
    setIsSubmit(false);
    closeModal(); 
  }

  return (
    <>
      <button className="btn" type="button" onClick={openModal}>
        Track
      </button>
      <Transition appear show={isOpen}>
        <Dialog
          as="div"
          className="dialog-container"
          onClose={closeModal}
        >
          <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <TransitionChild
                enter="ease-out duration-300"
                enterFrom="opacity-0 transform-[scale(95%)]"
                enterTo="opacity-100 transform-[scale(100%)]"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 transform-[scale(100%)]"
                leaveTo="opacity-0 transform-[scale(95%)]"
              >
                <DialogPanel className="w-full max-w-md rounded-xl bg-white p-6 backdrop-blur-2xl">
                  <div className="flex flex-col">
                    <div className="flex justify-between">
                      <div className="p-3 border-gray-200 rounded-10">
                        <Image
                          src="/assets/icons/logo.svg"
                          width={28}
                          height={28}
                          alt="logo"
                        />
                      </div>
                      <Image
                        src="/assets/icons/x-close.svg"
                        width={24}
                        height={24}
                        alt="close"
                        className="cursor-pointer"
                        onClick={closeModal}
                      />
                    </div>
                    <h4 className="dialog-head_text">
                      Stay updated with product pricing alerts right in your
                      inbox!
                    </h4>
                    <p className="text-sm text-gray-600 mt-2">Never miss a bargain again with our timely alerts</p>
                  </div>
                  <form className="flex flex-col mt-5" onSubmit={handleSubmit}>
                    <label
                      htmlFor="email"
                      className="text-sm font-medium text-gray-700 "
                    >
                      Email Address
                    </label>
                    <div className="dialog-input_container">
                      <Image
                        src="/assets/icons/mail.svg"
                        width={18}
                        height={18}
                        alt="email"
                      />
                      <input
                      required
                        type="email"
                        id="email"
                        placeholder="Enter your email address"
                        className="dialog-input"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="dialog-btn">
                        {isSubmit ? 'Submitting...' : "Track"}
                    </button>
                  </form>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default Modal;
