import React, { useState } from 'react';

const ChatApp: React.FC = () => {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [inputValue, setInputValue] = useState('');
  const [showStartButton, setShowStartButton] = useState(true);

  // 質問を開始するボタンが押されたときの処理
  const handleStartChat = async () => {
    setShowStartButton(false); // ボタンを非表示にする

    const apiKey = import.meta.env.VITE_ASSISTANTSAPI_KEY;

    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`, // 実際のAPIキーに置き換え
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: '1' }],
          }),
        }
      );

      const data = await response.json();
      console.log('API全体の応答:', data); // レスポンス全体をログ出力

      // データが正しい形式で返っているか確認
      if (data.choices && data.choices.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'GPT', text: data.choices[0].message.content },
        ]);
      } else {
        console.warn('期待した応答がありません:', data);
        setMessages((prevMessages) => [
          ...prevMessages,
          { sender: 'GPT', text: '応答がありませんでした' },
        ]);
      }
    } catch (error) {
      console.error('ChatGPT APIとの通信エラー:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'GPT', text: 'エラーが発生しました' },
      ]);
    }
  };

  const handleSendMessage = async () => {
    if (inputValue.trim() === '') return;

    // 翻訳リクエストの例
    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbzVUg2yBkxK92GWjBwqiBJZCLe8CajqUpU6MLrdmw2YHx8NKq2i5EXmZ1622ywoh9MfoA/exec?text=${encodeURIComponent(
          inputValue
        )}&source=ja&target=en`
      );
      const data = await response.json();
      console.log('翻訳結果:', data.text);

      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: 'user', text: inputValue },
        { sender: 'translated', text: data.text },
      ]);

      setInputValue('');
    } catch (error) {
      console.error('Error translating text:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div style={styles.container}>
      {/* 質問開始ボタン（1度だけ表示） */}
      {showStartButton && (
        <button style={styles.startButton} onClick={handleStartChat}>
          質問を開始する
        </button>
      )}

      <div style={styles.chatBox}>
        {messages.map((message, index) => (
          <div
            key={index}
            style={
              message.sender === 'user' ? styles.userBubble : styles.gptBubble
            }
          >
            {message.sender === 'translated'
              ? `翻訳: ${message.text}`
              : message.text}
          </div>
        ))}
      </div>
      <div style={styles.inputSection}>
        <input
          style={styles.inputField}
          type="text"
          placeholder="回答欄"
          value={inputValue}
          onChange={handleInputChange}
        />
        <button style={styles.nextButton} onClick={handleSendMessage}>
          次へ
        </button>
        <button style={styles.resultButton}>結果発表</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100vh',
    justifyContent: 'center',
  },
  chatBox: {
    width: '50%',
    minHeight: '300px',
    border: '2px solid black',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '20px',
    overflowY: 'auto',
  },
  userBubble: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    padding: '8px',
    margin: '5px 0',
  },
  gptBubble: {
    alignSelf: 'flex-end',
    backgroundColor: '#d0e0ff',
    borderRadius: '10px',
    padding: '8px',
    margin: '5px 0',
  },
  inputSection: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    width: '50%',
    height: '30px',
    border: '1px solid black',
    borderRadius: '5px',
    padding: '5px',
    marginRight: '10px',
  },
  nextButton: {
    padding: '5px 10px',
    border: '2px solid green',
    borderRadius: '5px',
    marginRight: '10px',
  },
  resultButton: {
    padding: '5px 10px',
    border: '2px solid red',
    borderRadius: '5px',
  },
  startButton: {
    padding: '10px 20px',
    fontSize: '16px',
    border: '2px solid blue',
    borderRadius: '5px',
    marginBottom: '20px',
    cursor: 'pointer',
  },
};

export default ChatApp;
