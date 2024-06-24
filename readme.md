실행 방법

1. 가상환경 설정
```bash
python3 -m venv venv
source venv/bin/activate
```

2. 의존성 설치
```bash
pip install -r requirements.txt
```

3. 실행
```bash
uvicorn main:app --reload
```