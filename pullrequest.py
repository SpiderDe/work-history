import os
import time
import random
import requests

def make_changes(filename):
    with open(filename, 'a') as file:
        file.write(f'\n# {random.randint(1, 100)} Random Change')

def commit_and_push():
    os.system('git checkout -b pull')
    os.system('git add .')
    os.system('git commit -m "Automated commit"')
    os.system('git push -u origin pull')

def create_pull_request(repo_owner, repo_name, base_branch, head_branch, title, body, token):
    url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/pulls'
    headers = {
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    data = {
        "title": title,
        "body": body,
        "head": head_branch,
        "base": base_branch
    }
    response = requests.post(url, headers=headers, json=data)
    return response.json()

def merge_pull_request(repo_owner, repo_name, pull_request_number, token):
    url = f'https://api.github.com/repos/{repo_owner}/{repo_name}/pulls/{pull_request_number}/merge'
    headers = {
        'Authorization': f'token {token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    response = requests.put(url, headers=headers)
    return response.status_code == 200

def main():
    repo_owner = 'SpiderDe'
    repo_name = 'my-history'
    base_branch = 'master'
    head_branch = 'pull'
    title = 'Automated Pull Request'
    body = 'This pull request was generated automatically.'
    token = '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'
    file_path = 'D:\\my-history\\foo.txt'

    #while True:
        make_changes(file_path)
        commit_and_push()

        # Create pull request
        pull_request = create_pull_request(repo_owner, repo_name, base_branch, head_branch, title, body, token)
        if 'number' in pull_request:
            pull_request_number = pull_request['number']
            print(f'Pull request created: #{pull_request_number}')

            # Merge pull request
            if merge_pull_request(repo_owner, repo_name, pull_request_number, token):
                print(f'Pull request #{pull_request_number} merged successfully')
            else:
                print(f'Failed to merge pull request #{pull_request_number}')

        # Wait for a period of time (e.g., 1 hour) before creating the next pull request
        # time.sleep(3600)

if __name__ == "__main__":
    main()