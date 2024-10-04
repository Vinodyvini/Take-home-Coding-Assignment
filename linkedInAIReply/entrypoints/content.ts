export default defineContentScript({
  matches: ['*://*.linkedin.com/*'],
  async main() {
    console.log('Content script running on LinkedIn.');

    const insertTextIntoLinkedIn = (text: string) => {
      // Select the message input and the placeholder div
      const messageInput = document.querySelector('.msg-form__contenteditable') as HTMLElement;
      const placeholderDiv = document.querySelector('.msg-form__placeholder') as HTMLElement;

      if (messageInput) {
      
        // Remove the placeholder div if it exists
        if (placeholderDiv) {
          placeholderDiv.style.display = 'none';  // Hide the placeholder div
        }

        // Clear the existing content in the input field
        messageInput.innerHTML = '';  // This clears all the content in the input fiel

        // Insert your text into the message input field
        messageInput.textContent = text;

        // Move the caret to the end of the inserted text
        const range = document.createRange();
        const selection = window.getSelection();
        range.selectNodeContents(messageInput);
        range.collapse(false); // Place caret at the end of the text
        selection?.removeAllRanges();
        selection?.addRange(range);
        
        console.log('Text inserted into LinkedIn message input.');
      } else {
        console.error('Message input not found for text insertion.');
      }
    };
    let aiIcon: HTMLDivElement | null = null;
    let modal: HTMLDivElement | null = null;
    let secondModal: HTMLDivElement | null = null;

    const createFirstModal = () => {
      const modalOverlay = document.createElement('div');
      modalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';

      const modalContent = document.createElement('div');
      modalContent.className = 'bg-white p-4 rounded shadow-lg w-96';
      modalContent.innerHTML = `
        <input type="text" id="firstInput" placeholder="Your prompt" class="border p-2 mb-4 w-full"/>
        <button id="generateBtn" class="bg-blue-500 p-2 text-white w-full">Generate</button>
      `;

      modalOverlay.appendChild(modalContent);
      document.body.appendChild(modalOverlay);

      modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });

      const generateBtn = document.getElementById('generateBtn');
      const firstInput = document.getElementById('firstInput') as HTMLInputElement;

      generateBtn?.addEventListener('click', () => {
        if (firstInput.value) {
          closeModal();
          createSecondModal(firstInput.value);
        }
      });

      modal = modalOverlay;
    };

    const createSecondModal = (prompt: string) => {
      const secondModalOverlay = document.createElement('div');
      secondModalOverlay.className = 'fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50';

      const secondModalContent = document.createElement('div');
      secondModalContent.className = 'bg-white p-4 rounded shadow-lg w-96';
      secondModalContent.innerHTML = `
        <p class="mb-2">${prompt}</p>
        <p class="mb-2">Thank you for the opportunity! If you have any more questions or if there\'s anything else I can help you with, feel free to ask.</p>
        <input type="text" id="secondInput" placeholder="Type more..." class="border p-2 mb-4 w-full"/>
        <div class="flex justify-between">
          <button id="insertBtn" class="bg-green-500 p-2 text-white">Insert</button>
          <button id="regenerateBtn" class="bg-gray-500 p-2 text-white">Regenerate</button>
        </div>
      `;

      secondModalOverlay.appendChild(secondModalContent);
      document.body.appendChild(secondModalOverlay);

      secondModalOverlay.addEventListener('click', (e) => {
        if (e.target === secondModalOverlay) {
          closeSecondModal();
        }
      });

      const insertBtn = document.getElementById('insertBtn');
      const regenerateBtn = document.getElementById('regenerateBtn');
      const secondInput = document.getElementById('secondInput') as HTMLInputElement;

      insertBtn?.addEventListener('click', () => {
        const finalText = `Thank you for the opportunity! If you have any more questions or if there\'s anything else I can help you with, feel free to ask.`;
        insertTextIntoLinkedIn(finalText);
        closeSecondModal();
      });

      regenerateBtn?.addEventListener('click', () => {
        console.log('Regenerate button clicked');
      });

      secondModal = secondModalOverlay;
    };

    const closeModal = () => {
      if (modal) {
        modal.remove();
        modal = null;
        console.log('First modal closed.');
      }
    };

    const closeSecondModal = () => {
      if (secondModal) {
        secondModal.remove();
        secondModal = null;
        console.log('Second modal closed.');
      }
    };

    const insertAiIcon = () => {
      const messageInput = document.querySelector('.msg-form__contenteditable');

      if (!messageInput) {
        console.log('Message input not found');
        return;
      }

      if (!aiIcon) {
        aiIcon = document.createElement('div');
        aiIcon.className = 'ai-icon cursor-pointer bg-white text-blue-500 p-2 rounded-full flex items-center justify-center shadow-md hover:bg-blue-200 transition absolute bottom-2 right-2';
        aiIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" class="h-6 w-6">
        <path d="M15.4667 8.73332C15.4667 8.88655 15.4063 9.03351 15.2989 9.14187C15.1915 9.25022 15.0458 9.3111 14.8938 9.3111H13.7482V10.4667C13.7482 10.6199 13.6879 10.7668 13.5804 10.8752C13.473 10.9836 13.3273 11.0444 13.1754 11.0444C13.0235 11.0444 12.8778 10.9836 12.7703 10.8752C12.6629 10.7668 12.6026 10.6199 12.6026 10.4667V9.3111H11.4569C11.305 9.3111 11.1593 9.25022 11.0519 9.14187C10.9445 9.03351 10.8841 8.88655 10.8841 8.73332C10.8841 8.58008 10.9445 8.43312 11.0519 8.32477C11.1593 8.21641 11.305 8.15554 11.4569 8.15554H12.6026V6.99998C12.6026 6.84675 12.6629 6.69979 12.7703 6.59143C12.8778 6.48308 13.0235 6.42221 13.1754 6.42221C13.3273 6.42221 13.473 6.48308 13.5804 6.59143C13.6879 6.69979 13.7482 6.84675 13.7482 6.99998V8.15554H14.8938C15.0458 8.15554 15.1915 8.21641 15.2989 8.32477C15.4063 8.43312 15.4667 8.58008 15.4667 8.73332ZM1.719 2.95554H2.86464V4.11109C2.86464 4.26433 2.92499 4.41129 3.03241 4.51965C3.13984 4.628 3.28554 4.68887 3.43746 4.68887C3.58938 4.68887 3.73508 4.628 3.8425 4.51965C3.94993 4.41129 4.01028 4.26433 4.01028 4.11109V2.95554H5.15592C5.30784 2.95554 5.45354 2.89467 5.56096 2.78631C5.66839 2.67796 5.72874 2.531 5.72874 2.37776C5.72874 2.22453 5.66839 2.07757 5.56096 1.96921C5.45354 1.86086 5.30784 1.79998 5.15592 1.79998H4.01028V0.644428C4.01028 0.491192 3.94993 0.344232 3.8425 0.235878C3.73508 0.127523 3.58938 0.0666504 3.43746 0.0666504C3.28554 0.0666504 3.13984 0.127523 3.03241 0.235878C2.92499 0.344232 2.86464 0.491192 2.86464 0.644428V1.79998H1.719C1.56708 1.79998 1.42138 1.86086 1.31396 1.96921C1.20653 2.07757 1.14618 2.22453 1.14618 2.37776C1.14618 2.531 1.20653 2.67796 1.31396 2.78631C1.42138 2.89467 1.56708 2.95554 1.719 2.95554ZM10.8841 11.6222H10.3113V11.0444C10.3113 10.8912 10.2509 10.7442 10.1435 10.6359C10.0361 10.5275 9.89039 10.4667 9.73847 10.4667C9.58655 10.4667 9.44085 10.5275 9.33343 10.6359C9.226 10.7442 9.16565 10.8912 9.16565 11.0444V11.6222H8.59283C8.44091 11.6222 8.29521 11.6831 8.18779 11.7914C8.08036 11.8998 8.02001 12.0467 8.02001 12.2C8.02001 12.3532 8.08036 12.5002 8.18779 12.6085C8.29521 12.7169 8.44091 12.7778 8.59283 12.7778H9.16565V13.3555C9.16565 13.5088 9.226 13.6557 9.33343 13.7641C9.44085 13.8724 9.58655 13.9333 9.73847 13.9333C9.89039 13.9333 10.0361 13.8724 10.1435 13.7641C10.2509 13.6557 10.3113 13.5088 10.3113 13.3555V12.7778H10.8841C11.036 12.7778 11.1817 12.7169 11.2892 12.6085C11.3966 12.5002 11.4569 12.3532 11.4569 12.2C11.4569 12.0467 11.3966 11.8998 11.2892 11.7914C11.1817 11.6831 11.036 11.6222 10.8841 11.6222ZM13.4124 3.53332L3.43746 13.5946C3.22263 13.8111 2.93135 13.9328 2.62764 13.9328C2.32392 13.9328 2.03264 13.8111 1.81781 13.5946L0.335642 12.101C0.229232 11.9937 0.144822 11.8663 0.0872316 11.7261C0.0296415 11.5859 0 11.4356 0 11.2838C0 11.1321 0.0296415 10.9818 0.0872316 10.8416C0.144822 10.7014 0.229232 10.574 0.335642 10.4667L10.3113 0.405373C10.4177 0.298041 10.544 0.2129 10.683 0.154812C10.822 0.0967231 10.971 0.0668251 11.1215 0.0668251C11.2719 0.0668251 11.4209 0.0967231 11.5599 0.154812C11.699 0.2129 11.8253 0.298041 11.9317 0.405373L13.4124 1.89893C13.5188 2.00623 13.6032 2.13363 13.6608 2.27385C13.7184 2.41407 13.748 2.56435 13.748 2.71612C13.748 2.86789 13.7184 3.01818 13.6608 3.1584C13.6032 3.29861 13.5188 3.42601 13.4124 3.53332ZM12.6026 2.71648L11.1211 1.22221L8.82984 3.53332L10.3113 5.0276L12.6026 2.71648Z" fill="#2563EB"/>
        </svg>`;

        if (!messageInput.parentElement?.contains(aiIcon)) {
          messageInput.parentElement?.appendChild(aiIcon);
        }

        aiIcon.addEventListener('click', (e) => {
          e.stopPropagation();
          createFirstModal();
        });
      }
    };

    // Function to show/hide AI icon based on focus of the message input
    const toggleAiIcon = (show: boolean) => {
      if (aiIcon) {
        aiIcon.style.display = show ? 'flex' : 'none';
      }
    };

    // Detect click outside the message input field
    document.addEventListener('click', (e) => {
      const messageInput = document.querySelector('.msg-form__contenteditable');
      if (messageInput && !messageInput.contains(e.target as Node) && !aiIcon?.contains(e.target as Node)) {
        toggleAiIcon(false);  // Hide AI icon when clicked outside
      }
    });

    // Show the AI icon when the message input is focused
    const messageInput = document.querySelector('.msg-form__contenteditable');
    document.addEventListener('focusin', () => {
      insertAiIcon();
      toggleAiIcon(true);  // Show AI icon
    });
  }
});
