# include <iostream>
using namespace std;
int main(){
    int a ;
    cout<<"enter the number:";
    cin>>a;
    (a<0)? cout <<"negative": (a>0)? cout<<"positive": cout<<"zero"; 
    return 0;
}